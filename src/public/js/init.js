const socket = io(); //백엔드 socket.io 서버를 찾아서 연결해줌.

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const msgForm = room.querySelector("form");

let roomName;

msgForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const inputmsg = msgForm.querySelector("input");
    socket.emit("message", inputmsg.value, roomName, (msg)=>{
        addMessage(`나 : ${msg}`);
    });
    inputmsg.value = "";
})

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const inputnick = document.getElementById("nickname");
    const inputroom = document.getElementById("roomname");
    roomName = inputroom.value;
    socket.emit("enter_room", inputnick.value, roomName, ()=>{
        welcome.style.display = "none";
        room.style.display = "";
        const h3 = room.querySelector("h3");
        h3.innerText = roomName;
        inputnick.value = "";
        inputroom.value = "";
        addMessage("관리자 : 건전한 채팅문화를 위해 비속어 사용을 자제해주세요.");
    }); //emit(이벤트명, 데이터(개수에 제약없음), 서버측에 넘겨줄 콜백함수(호출은 서버에서 하지만 실행은 클라이언트에서 됨))
    //서버측에서 처리 후 서버로부터 파라미터를 넘겨받아서 콜백함 수 실행가능
});

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${msg}`;
    ul.appendChild(li);
}

socket.on("welcome-msg", (nickname)=>{addMessage(`${nickname}님이 입장하셨습니다.`)});
socket.on("bye", (nickname)=>addMessage(`${nickname}님이 퇴장하셨습니다.`));
socket.on("message", (msg)=>addMessage(msg));