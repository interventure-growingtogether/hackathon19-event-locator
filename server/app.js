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
    db.get('SELECT * FROM space s JOIN user u ON s.host_id = u.id WHERE s.id = ?', [req.params.spaceId], (err, row) => {
        if (row) {
            console.log(row.photos);
            res.send(({...row, amenities: JSON.parse(row.amenities), photos: JSON.parse(row.photos)}));
        } else {
            res.status(404).send();
        }
    });
});

app.get('/space', (req, res) => {
    if (req.query.filters) {
        console.log(req.query.filters);
        const filters = JSON.parse(Buffer.from(req.query.filters, 'base64').toString());
        let query = 'SELECT * FROM space';
        const keys = [];
        const values = [];
        Object.keys(filters).forEach((key) => {
            if (key === 'wifi' && filters[key]) {
                keys.push('json_extract(space.amenities, "$.wifi") = ?');
                values.push(filters[key]);
            }

            if (key === 'city_id') {
                keys.push('city_id = ?');
                values.push(filters[key]);
            }
        });
        if (keys.length) {
            query += ' WHERE ' + keys.join(' AND ');
        }
        db.all(query, values, (err, rows) => {
            console.log(query, err)
            res.send(rows.map(r => ({
                ...r,
                amenities: JSON.parse(r.amenities),
                photos: JSON.parse(r.photos)
            })));
        });
    } else {
        db.all("SELECT * FROM space INNER JOIN user ON space.host_id = user.id", (err, rows) => {
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
