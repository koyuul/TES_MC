const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const rethinkdb = require('rethinkdb')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

// the current thing is that on websocket connection, the changes will have alread processed and been emitted...
// Subscribe to TES13 powerboard's changes, and emit changes via a websocket. Save a buffer of data to pass to websocket on initial connection..
let data = [];
rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
    if (err) throw err;
    console.log('RethinkDB Connected');

    rethinkdb.db('TES_13').table('Powerboard')
        .orderBy({ index: rethinkdb.desc('EPOCH') })
        .limit(10)
        .changes({ includeInitial: true })
        .run(conn, function (err, cursor) {
            cursor.each((err, change) => {
                if (err) throw err;
                console.log(`Sending packet from ${change['new_val']['EPOCH']} to websocket`);
                data.push(change);
                io.emit('change', change);
            });
        });
});

// Handle websocket connect/disconnects
io.on('connection', (socket) => {
    console.log(`User connected to ${socket}`);

    console.log(`Sending initial data to ${socket}`);
    socket.emit('initialData', data);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})

// Listen to current port (3000)
server.listen(PORT, () => {
    console.log(`TES_MC server listening at http://localhost:${PORT}/`);
})

// // Allow CORS requests so that we can request data freely


// app.get('/TES13', (req, res) => {
//     rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
//         if (err) {
//             res.send(err)
//             console.log(`No rethinkdb connection at http://localhost:${port}/TES13. Have you started the server?`)
//             return;
//         }

//         connection = conn;
//         console.log('test');
//         rethinkdb.db('TES_13')
//             .table('Powerboard')
//             .orderBy({ index: rethinkdb.desc('EPOCH') })
//             .limit(10)
//             .changes({ includeInitial: true })
//             .run(conn, function (err, cursor) {
//                 if (err) throw err;
//                 cursor.each(console.log);
//                 // let packets = [];
//                 // cursor.each(function (err, row) {
//                 //     if (err) throw err;
//                 //     packets.push(row);
//                 // });
//                 // console.log(packets);
//                 // res.json(packets);
//             })
//     });
// });


// app.get('/', (req, res) => {
//     res.send('success boi')
// })

// const port = process.env.PORT || 3000;
// app.listen(3000, () => console.log(`TES_MC Server listening at http://localhost:${port}/`));