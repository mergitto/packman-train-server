const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;
import {
    getLastLocation,
    createLocation
} from './api';

const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 3000;
const server = http.createServer(app).listen(port, () => {
    console.log('Server listening at port %d', port);
});

const wss = new WebSocketServer({
    server: server
});

let connections = [];
let socket_number = 0;
wss.on('connection', ws => {
    connections.push(ws);
    ws.id = socket_number;
    socket_number++;

    ws.on('close', () => {
        console.log('close');
        connections = connections.filter((conn, i) => {
            return (conn === ws) ? false : true;
        });
    });

    ws.on('message', message => {
        // console.log('message:', message);
        // parseが必要
        const location = JSON.parse(message)
        const {
            lat,
            lon
        } = location.value;

        connections.forEach((con, i) => {
            console.log(ws.id)
            if (con == ws) {
                const req = createLocation(ws.id, lat, lon);
                req
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            // postが終わってからで,というかgetアクションいるかな
            const locations = getLastLocation(ws.id)
            locations
                .then((result) => {
                    const record = result.records[0];
                    if (record === undefined) {
                        con.send(JSON.stringify({}));
                        return
                    }
                    const response = {
                        action: "location",
                        value: {
                            lat: record.lat.value,
                            lon: record.lon.value
                        }
                    };
                    con.send(JSON.stringify(response));
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        console.log(ws.id);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
