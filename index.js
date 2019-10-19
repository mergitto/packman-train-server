const express = require('express');
const app = express();
app.use(express.static('public'));

const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer(app).listen(port, () => {
    console.log('Server listening at port %d', port);
});

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    server: server
});

const currentRoom = [];
let connections = [];
wss.on('connection', ws => {
    let num = 0;
    connections.push(ws);
    ws.on('close', () => {
        console.log('close');
        connections = connections.filter((conn, i) => {
            return (conn === ws) ? false : true;
        });
    });
    ws.on('message', message => {
        console.log('message:', message);
        connections.forEach(function (con, i) {
            con.send(num);
        });
        num++;
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function joinRoom(socket, room){
    socket.join(room)
    currentRoom[socket.id] = room
    socket.broadcast.to(room).emit("message", {
        text: socket.id + " joined room"
    })
}
