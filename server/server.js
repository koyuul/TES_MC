const express = require('express');
const app = express();
rethinkdb = require('rethinkdb')

// Allow CORS requests so that we can request data freely
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/TES13', (req, res) => {
    rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
        if (err) {
            res.send(err)
            console.log(`No rethinkdb connection at http://localhost:${port}/TES13. Have you started the server?`)
            return;
        }

        connection = conn;
        rethinkdb.db('TES_13').table('Powerboard').orderBy({ index: rethinkdb.desc('EPOCH') }).sample(10).run(connection, (err, cursor) => {
            if (err) throw err;
            cursor.toArray((err, result) => {
                res.json(result)
            });
        })
    });
});


app.get('/', (req, res) => {
    res.send('success boi')
})

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`TES_MC Server listening at http://localhost:${port}/`));