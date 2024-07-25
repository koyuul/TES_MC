const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const rethinkdb = require('rethinkdb')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const startDatetime = new Date("2024-06-24T00:00:00.000Z");
const endDatetime = new Date("2024-07-01T11:59:59.000Z");

/*
TODO: 

    Find  a way to efficiently implement a custom date slider.
        - right now, it loads ands saves the changes in an array, then serves that array when a user connects
        - but when we implement a date slider, we have to req EPOCH's between startdate and endate
        - what are some ways that we can restructure the code so that we can do that?

    solution:
        - for initial data, load the inital epoch bounds 2024-06-24T00:00 to 2024-07-01T00:00
        - if the websocket asks for a new date range:
            - if it's within our min and max bounds
            - else we request that chunk

    should look like:
        values = {
            'SP1V': [
                ['12-29-2002:[...]', 0.123] // dates are sorted
            ]
        }
*/

// Subscribe to TES13 powerboard's changes, and emit changes via a websocket. Save a buffer of data to pass to websocket on initial connection..
let data = [];
let values = {
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

rethinkdb.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
    if (err) throw err;
    console.log('RethinkDB Connected');
    rethinkdb.db('TES_13').table('Powerboard')
        .orderBy({ index: rethinkdb.desc('EPOCH') })
        .between(startDatetime, endDatetime)
        .limit(500)
        .changes({ includeInitial: true })
        .run(conn, function (err, cursor) {
            cursor.each((err, change) => {
                if (err) throw err;
                console.log(`Saving packet from ${change['new_val']['EPOCH']} to data`);
                data.push(change['new_val']);
            });

            let dataNeeded = new Set();
            // Handle websocket connect/disconnects
            io.on('connection', (socket) => {
                console.log(`User connected to ${socket}`);

                console.log(`Sending initial data to ${socket}`);
                socket.emit('initialData', data);

                socket.on('initialRequest', (parameters) => {
                    console.log(parameters)
                    socket.emit('initialResponse', values[parameters.query.type])
                })

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                });
            })


        });
});

// Listen to current port (3000)
server.listen(PORT, () => {
    console.log(`TES_MC server listening at http://localhost:${PORT}/`);
})
