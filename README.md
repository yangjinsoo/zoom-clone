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