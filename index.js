const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;
import {
    getLastLocation
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
        connections.forEach((con, i) => {
            // con.send(i);
            const locations = getLastLocation(100)
            locations
                .then((result) => {
                    const record = result.records[0];
                    const response = {
                        action: "location",
                        value: {
                            lat: record.lat.value,
                            lon: record.lon.value
                        }
                    }
                    con.send(JSON.stringify(response));
                })
                .catch((err) => {
                    console.log(err);
                });
            con.send(message);
        });
        console.log(ws.id);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
