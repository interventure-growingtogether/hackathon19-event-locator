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

app.get('/space/:spaceId', (req, res) => {
    db.get('SELECT * FROM space WHERE space.id = ?', [req.params.spaceId], (err, row) => {
        if (row) {
            res.send(({...row, amenities: JSON.parse(row.amenities), photos: JSON.parse(row.photos)}));
        } else {
            res.status(404).send();
        }
    });
});

app.get('/space', (req, res) => {
    if (req.query.filters) {
        const filters = JSON.parse(Buffer.from(req.query.filters, 'base64').toString());
        let query = 'SELECT * FROM space';
        const keys = [];
        const values = [];
        Object.keys(filters).forEach((key) => {

            ['wifi', 'everyChairHasAComputer', 'toilet', 'soundSystem', 'heatingAc', 'projector'].forEach(k => {
                if (key === k && filters[key]) {
                    keys.push(`json_extract(space.amenities, "$.${key}") = ?`);
                    values.push(filters[key]);
                }
            });

            if (key === 'city_id') {
                keys.push('city_id = ?');
                values.push(filters[key]);
            }

            if (key === 'priceRange') {
                keys.push('price BETWEEN ? AND ?');
                values.push(filters[key][0]);
                values.push(filters[key][1]);
            }

            if (key === 'guestsRange') {
                keys.push('guests BETWEEN ? AND ?');
                values.push(filters[key][0]);
                values.push(filters[key][1]);
            }
        });
        if (keys.length) {
            query += ' WHERE ' + keys.join(' AND ');
        }
        db.all(query, values, (err, rows) => {
            res.send(rows.map(r => ({
                ...r,
                amenities: JSON.parse(r.amenities),
                photos: JSON.parse(r.photos)
            })));
        });
    } else {
        db.all("SELECT * FROM space", (err, rows) => {
            const parsedRows = rows.map(r => ({
                ...r,
                amenities: JSON.parse(r.amenities),
                photos: JSON.parse(r.photos)
            }));
            res.send(parsedRows);
        })
    }
});

app.listen(port, function () {
    console.log('app listening on port: ' + port);
});
