const express = require("express");
const http = require("http");
const SocketIO = require("socket.io");

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug'); //템플릿 엔진으로 pug사용
app.set("views", __dirname + '/views'); //views폴더 경로 설정
app.use("/public", express.static(__dirname + "/public")); //브라우저에서 public 접근가능하게.

app.get("/", (req, res) => res.render("main"));

const server = http.createServer(app);
const wsServer = SocketIO(server);

wsServer.on("connection", async (socket)=>{
    console.log(`현재 전체 접속자 수 : ${(await wsServer.fetchSockets()).length}`);
    console.log(socket.rooms);

    socket.on("enter_room", async (nickname, roomName, done)=>{
        socket["nickname"] = nickname;
        socket.join(roomName);
        console.log(`현재 ${roomName} 접속자 수 : ${(await wsServer.in(roomName).fetchSockets()).length}`);
        console.log(socket.rooms);
        done();
        socket.to(roomName).emit("welcome-msg", socket.nickname);
    });//클라이언트 측 emit의 인자를 받음
    //done 으로 넘겨받아서 실행하면 함수자체는 클라이언트측에서 실행됨

    socket.on("message", (msg, roomName, done)=>{
        socket.to(roomName).emit("message", `${socket.nickname} : ${msg}`);
        done(msg);
    });

    socket.on("disconnecting", ()=>{
        // socket.to(Array.from(socket.rooms)).emit("bye", socket.nickname);
        socket.rooms.forEach(async (room) => {
            console.log(`현재 ${room} 접속자 수 : ${(await wsServer.in(room).fetchSockets()).length-1}`);
            socket.to(room).emit("bye", socket.nickname);
        });
    });

    socket.on("disconnect", async ()=>{
        console.log(`현재 전체 접속자 수 : ${(await wsServer.fetchSockets()).length}`);
    })
});

server.listen(app.get('port'), () => {
    console.log(`Listening on http://localhost:${app.get('port')}`);
});