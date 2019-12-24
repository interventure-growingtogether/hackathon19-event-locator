const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');
const cors = require('cors');
const port = 3001;

app.use(cors());

const db = new sqlite.Database('./asd.db');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/city', (req, res) => {
    db.all('SELECT * FROM city', (err, rows) => {
        res.send(rows);
    });
});

app.get('/review/:spaceId', (req, res) => {
    db.all('SELECT * FROM review left join user on review.user_id = user.id WHERE review.space_id = ?', [req.params.spaceId], (err, rows) => {
        res.send(rows);
    });
});

app.get('/user/:userId', (req, res) => {
    db.get('SELECT * FROM user WHERE id = ?', [req.params.userId], (err, row) => {
        if (row) {
            res.send(row);
        } else {
            res.status(404).send();
        }
    });
});

app.get('/space/:spaceId', (req, res) => {
    const selectSpaceQuery = `
        select	s.id, s.name, s.coords, s.short_description, s.description, s.amenities, s.price, s.guests, s.photos, s.host_id, avg(r.rating) as rating, c.name as city_name
        from 	space s left join review r on r.space_id = s.id left join city c on c.id = s.city_id
        where 	s.id = ?`;
    db.get(selectSpaceQuery, [req.params.spaceId], (err, row) => {
        if (row) {
            res.send(({...row, amenities: JSON.parse(row.amenities), photos: JSON.parse(row.photos)}));
        } else {
            res.status(404).send();
        }
    });
});

app.get('/space', (req, res) => {
    let filterSpacesQuery = `
            select	s.id, s.name, s.coords, s.short_description, s.description, s.amenities, s.price, s.guests, s.photos, s.host_id, avg(rv.rating) as rating, c.name as city_name
            from 	space s 
                    left join review rv on rv.space_id = s.id
                    left join city c on c.id = s.city_id
                    left join reservation rs on rs.space_id = s.id `;
    if (req.query.filters) {
        const filters = JSON.parse(Buffer.from(req.query.filters, 'base64').toString());
        const keys = [];
        const values = [];
        Object.keys(filters).forEach((key) => {

            ['wifi', 'everyChairHasAComputer', 'toilet', 'soundSystem', 'heatingAc', 'projector'].forEach(k => {
                if (key === k && filters[key]) {
                    keys.push(`json_extract(s.amenities, "$.${key}") = ?`);
                    values.push(filters[key]);
                }
            });

            if (key === 'city_id') {
                keys.push('s.city_id = ?');
                values.push(filters[key]);
            }

            if (key === 'priceRange') {
                keys.push('s.price BETWEEN ? AND ?');
                values.push(filters[key][0]);
                values.push(filters[key][1]);
            }

            if (key === 'guestsRange') {
                keys.push('s.guests BETWEEN ? AND ?');
                values.push(filters[key][0]);
                values.push(filters[key][1]);
            }

            if (key === 'dateRange' && filters[key].length == 2) {
                keys.push(`rs.timestamp_start not between ? and ? and rs.timestamp_end not between ? and ? or rs.timestamp_start is null and rs.timestamp_end is null`);
                values.push(filters[key][0]);
                values.push(filters[key][1]);
                values.push(filters[key][0]);
                values.push(filters[key][1]);
            }
        });
        if (keys.length) {
            filterSpacesQuery += ' where ' + keys.join(' and ') + ' group by s.id';
        }

        if (Object.keys(filters).includes('scoreRange')) {
            filterSpacesQuery += ' having (rating between ? and ? or rating is null)';
            values.push(filters['scoreRange'][0]);
            values.push(filters['scoreRange'][1]);
        }

        db.all(filterSpacesQuery, values, (err, rows) => {
            res.send(rows.map(r => ({
                ...r,
                amenities: JSON.parse(r.amenities),
                photos: JSON.parse(r.photos)
            })));
        });
    } else {
        db.all(filterSpacesQuery, (err, rows) => {
            const parsedRows = rows.map(r => ({
                ...r,
                amenities: JSON.parse(r.amenities),
                photos: JSON.parse(r.photos)
            }));
            res.send(parsedRows);
        })
    }
});

app.post('/reserve', (req, res) => {
    if (req.body.dateStart && req.body.dateEnd && req.body.price && req.body.userId && req.body.spaceId) {
        console.log('tu je');
        const timeStart = req.body.dateStart;
        const timeEnd = req.body.dateEnd;
        const price = req.body.price;
        const userId = req.body.userId;
        const spaceId = req.body.spaceId;
        db.run(`INSERT INTO reservation(timestamp_start,timestamp_end, price, user_id, space_id) VALUES(?,?,?,?,?)`,
            [timeStart, timeEnd, price, userId, spaceId], function (err) {
                if (err) {
                    return console.log(err.message);
                }
                res.status(200).send();
            });
    } else {
        res.status(404).send();
    }
});

app.get('/reserve/space/:spaceId', (req, res) => {
    db.all(`select	rs.id, rs.timestamp_start, rs.timestamp_end, rs.price, rs.space_id, rs.user_id
            from 	reservation rs
            where	rs.space_id = ?`, [req.params.spaceId], (err, rows) => {
        res.send(rows);
    });
});

app.get('/reserve/user/:userId', (req, res) => {
    db.all(`select	rs.id, rs.timestamp_start, rs.timestamp_end, rs.price, rs.space_id, rs.user_id
            from 	reservation rs
            where	rs.user_id = ?`, [req.params.userId], (err, rows) => {
        res.send(rows);
    });
});

app.listen(port, function () {
    console.log('app listening on port: ' + port);
});
