const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug'); //템플릿 엔진으로 pug사용
app.set("views", __dirname + '/views'); //views폴더 경로 설정
app.use("/public", express.static(__dirname + "/public")); //브라우저에서 public 접근가능하게.

app.get("/", (req, res) => res.render("main"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//누가, 몇명이 접속해있는지 파악하기위해 접속한 소켓들 저장용
const connections = [];

//클라이언트와 웹소켓 연결됐을 때 실행
wss.on("connection", (socket, request)=>{
    console.log("Connected to Client!");
    connections.push(socket);
    socket["nickname"] = "noname";
    console.log("현재 접속자 수 : ", connections.length);

    //데이터 전달받았을 때 실행
    //toString("utf-8")로 디코딩해줘야 텍스트로 나옴
    socket.on("message", (message)=>{
        console.log(message.toString("utf-8"));
        const data = JSON.parse(message);
        switch(data.type){
            case "message":
                connections.forEach((s)=>{s.send(`${socket.nickname} : ${data.payload}`);});
                break;
            case "nickname":
                socket["nickname"] = data.payload;
                break;
        }
    });

    //클라이언트 측에서 연결을 끊었을 때 실행
    socket.on("close",()=>{
        console.log("Disconnectd from the Client");
    });

    //데이터 전송
    socket.send("hi, client!");
})

server.listen(app.get('port'), () => {
    console.log(`Listening on http://localhost:${app.get('port')}`);
});