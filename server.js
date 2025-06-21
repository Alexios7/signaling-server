const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let clients = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let data = JSON.parse(message);

    if (data.type === 'login') {
      clients[data.username] = ws;
      ws.username = data.username;
      console.log(`${data.username} connected`);
      return;
    }

    if (data.target && clients[data.target]) {
      clients[data.target].send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    if (ws.username) {
      delete clients[ws.username];
      console.log(`${ws.username} disconnected`);
    }
  });
});

console.log('Signaling server running');
