const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;
import getLastLocation from './api.js';

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
wss.on('connection', ws => {
    connections.push(ws);
    ws.on('close', () => {
        console.log('close');
        connections = connections.filter((conn, i) => {
            return (conn === ws) ? false : true;
        });
    });

    ws.on('message', message => {
        console.log('message:', message);
        connections.forEach((con, i) => {
            // con.send(i);
            getLastLocation(100)
            con.send(message);
        });
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
