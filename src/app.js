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

server.listen(app.get('port'), () => {
    console.log(`Listening on http://localhost:${app.get('port')}`);
});