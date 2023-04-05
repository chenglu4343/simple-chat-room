import { serverHostName, serverPort } from '../constant';
import { ClientMessage, ServerMessage } from '../types/message';
import express from 'express';
import WebSocket from 'ws';

const app = express();
const port = 8080;

const server = app.listen(serverPort, serverHostName,() => {
  console.log(`Server started on port ${port}`);
});

const wss = new WebSocket.Server({ server });

let wsList: WebSocket.WebSocket[] = []

wss.on('connection', (ws) => {
  wsList.push(ws)

  ws.addEventListener('message', (message) => {
    const { msg, user } = JSON.parse(message.data.toString()) as ClientMessage
    sendMessage({
      msg,
      user,
      exceptWs: [ws]
    })
  });

  ws.addEventListener('close', () => {
    wsList = wsList.filter(item => item !== ws)
    sendTotal()
  })

  ws.addEventListener('error', (event) => {
    console.error(event)
  })

  ws.send(JSON.stringify({
    type: "message",
    data: 'Hello! connected Successful!',
    user: null
  } as ServerMessage));

  sendTotal()
});

/** 更新total总人数 */
function sendTotal() {
  const total = wsList.length

  console.log('total user:', total)

  wsList.forEach((ws) => {
    ws.send(JSON.stringify({
      type: 'total',
      data: total
    } as ServerMessage))
  })
}

/** 发送消息 */
function sendMessage(options: {
  exceptWs?: WebSocket.WebSocket[],
  user: string,
  msg: string
}) {
  const { user, msg, exceptWs } = options
  wsList.forEach((ws) => {
    !exceptWs?.includes(ws) && ws.send(JSON.stringify({
      type: 'message',
      data: msg,
      user: user
    } as ServerMessage))
  })
}
