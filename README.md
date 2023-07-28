# ZoomClone Project

- Zoom Clone using WebRTC and Websockets

***
```javascript
const WebSocket = require("ws");

...

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(app.get('port'), () => {
    console.log(`Listening on http://localhost:${app.get('port')}`);
});
```
- 위와 같은 코드로 하나의 포트에서 http, ws 두 가지 프로토콜 사용가능하게 해준다
***
```javascript
msgForm.addEventListener("submit", (event)=>{
    event.preventDefault();

    ...
})
```
- preventDefault(); 가 submit 후 화면 새로고침하지 않게 해줌
***
### SocketIO
- 실시간 통신을 가능하게 지원해주는 프레임워크
- 브라우저가 websocket을 지원한다면 websocket으로 동작하고
- 지원하지않는다면 HTTP long-pooling으로 동작함.
```javascript
const SocketIO = require("socket.io");

...

const server = http.creattSerer(app);
const io = SocketIO(server);
```
- socket.io는 브라우저에서 기본 제공하지않기때문에 프론트쪽에 "/socket.io/socket.io.js"를 import 해줘야 사용가능
- "/socket.io/socket.io.js"는 socket.io설치하면 제공해줌

- socket.onAny
    - 어떠한 이벤트에도 모두 실행됨

- [Socket.IO](https://socket.io/ "socketio link")
- Room 개념
    - 여러 소켓들이 함께 메세지를 주고받을 수 있는 공간

- Adapter 개념
    - wsServer.sockets.sids  // 현재 서버에 접속해있는 socket들의 id
    - wsServer.sockets.rooms    // 현재 서버에 생성되어 있는 room들(소켓별로 생성되는 private도 포함)

- Socket.IO Admin UI
    - npm i @socket.io/admin-ui 명령어 실행 시 @ 사용으로 에러남.
    - npm i "@socket.io/admin-ui" 따옴표로 감싸서 해결