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
                        socket.emit('initialResponse', result);
                    });
                });
            console.log(`Sent initialResponse to ${socket}`);
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

const points = {
    'ATTACHMENT_NAME': [],
    'ATTACHMENT_SIZE': [],
    'BATTAI': [],
    'BATTMI': [],
    'BATTV': [],
    'CEP_RADIUS': [],
    'CF': [],
    'CMDRES': [],
    'CRK': [],
    'CYCT': [],
    'EPOCH': [],
    'GPS': [],
    'IMEI': [],
    'MESSAGE': [],
    'MET': [],
    'MOMSN': [],
    'MTMSN': [],
    'PKTNUM': [],
    'QUEUED': [],
    'QUEUE_SIZE': [],
    'R1': [],
    'R2': [],
    'R3': [],
    'R4': [],
    'R5': [],
    'RC1': [],
    'RC2': [],
    'RC3': [],
    'RC4': [],
    'RC5': [],
    'RO1': [],
    'RO2': [],
    'RO3': [],
    'RO4': [],
    'RO5': [],
    'RS1': [],
    'RS2': [],
    'RS3': [],
    'RS4': [],
    'RS5': [],
    'SM': [],
    'SP1V': [],
    'SP2V': [],
    'SP3V': [],
    'SP4V': [],
    'SPSENSE': [],
    'STATUS': [],
    'TIME': [],
    'TLCMD': [],
    'TYPE': [],
    'UNIT_LAT': [],
    'UNIT_LON': [],
    'id': []
};