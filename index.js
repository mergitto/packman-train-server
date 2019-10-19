const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;

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

function getLastLocation(socket_id) {
    const request = require('request');

    const url = encodeURI(`https://packman.cybozu.com/k/v1/records.json?app=5&query=socket_id=${socket_id}`);
    let params = {
        url: url,
        method: 'GET',
        json: true,
        // 本当はtokenを乗せてはいけない
        headers: {
            'X-Cybozu-API-Token': 'LPjpRT5Ekix06RdzJK78cwLpg0VlY2vrdYqA8zGi',
        },
    };

    request(params, function (err, resp, body) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(body);
    });
};
