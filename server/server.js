const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const rethinkdb = require('rethinkdb')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

// Handle websocket connect/disconnects
io.on('connection', (socket) => {
    console.log(`User connected to ${socket}`);
    let data = [];

    rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
        if (err) throw err;
        console.log('RethinkDB Connected');

        socket.on('initialRequest', (parameters) => {
            // Subscribe to TES13 powerboard's changes, and emit changes via a websocket. Save a buffer of data to pass to websocket on initial connection..
            const startDatetime = new Date(socket.handshake.query.startDatetime);
            const endDatetime = new Date(socket.handshake.query.endDatetime)
            rethinkdb.db('TES_13').table('Powerboard')
                .orderBy({ index: rethinkdb.desc('EPOCH') })
                .between(startDatetime, endDatetime)
                // .limit(500)
                // .changes({ includeInitial: true })
                .run(conn, function (err, cursor) {
                    cursor.toArray((err, result) => {
                        if (err) throw err;
                        data = result;
                        socket.emit('initialResponse', result);
                    });
                });
            console.log(`Sent initialResponse to ${socket}`);
        })

        socket.on('dateChangeRequest', (parameters) => {
            console.log('dateChangeRequest received')
            const newStartDatetime = new Date(parameters.query.newStartDatetime);
            const newEndDatetime = new Date(parameters.query.newEndDatetime);
            rethinkdb.db('TES_13').table('Powerboard')
                .orderBy({ index: rethinkdb.desc('EPOCH') })
                .between(newStartDatetime, newEndDatetime)
                // .limit(500)
                // .changes({ includeInitial: true })
                .run(conn, function (err, cursor) {
                    cursor.toArray((err, result) => {
                        if (err) throw err;
                        data = result;
                        socket.emit('dateChangeResponse', result);
                    });
                });
            console.log(`Sent dateChangeResponse to ${socket}`);
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
});

// Listen to current port (3000)
server.listen(PORT, () => {
    console.log(`TES_MC server listening at http://localhost:${PORT}/`);
})