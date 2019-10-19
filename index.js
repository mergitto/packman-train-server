var express = require('express');
var app = express();

//use path static resource files
app.use(express.static('public'));

var port = process.env.PORT || 3000;

//wake up http server
var http = require('http');

//Enable to receive requests access to the specified port
var server = http.createServer(app).listen(port, function () {
    console.log('Server listening at port %d', port);
});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: server
});

var connections = [];
wss.on('connection', function (ws) {
    console.log('connect!!');
    connections.push(ws);
    ws.on('close', function () {
        console.log('close');
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });
    ws.on('message', function (message) {
        console.log('message:', message);
        connections.forEach(function (con, i) {
            con.send(message);
        });
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
