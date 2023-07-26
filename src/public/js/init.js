//서버측과 소켓 연결
const socket = new WebSocket(`ws://${window.location.host}`);
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#msg-form");
const nickForm = document.querySelector("#nick-form");

//소켓 연결될 때 실행
socket.addEventListener("open", ()=>{
    console.log("Connected to Server!");
});

//data 전달받았을 때 실행
socket.addEventListener("message", (message)=>{
    // console.log("New message : ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    msgList.append(li);
});

//서버측에서 연결 끊었을 때 실행
socket.addEventListener("close", ()=>{
    console.log("Disconnected from the Server");
});

//소켓 생성 5초 후 메세지 전송
// setTimeout(()=>{
//     socket.send("hello, server!");
// }, 5000);

//메세지타입과 메세지를 함께 보내기 위해 json형태로 만들어 주는 함수
function makeJSON(type, payload) {
const data = { type, payload };
    return JSON.stringify(data); 
}

msgForm.addEventListener("submit", (event)=>{
    event.preventDefault(); //submit 후 화면이 새로 로딩되는 것을 막아줌.
    const input = msgForm.querySelector("input");
    socket.send(makeJSON("message", input.value));
    input.value = "";
})

nickForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeJSON("nickname", input.value));
    nickForm.remove(); //닉네임 설정 뒤 닉네임 수정 안되게 닉네임폼 지움.
    document.querySelector("#nickname").innerText = `${input.value} 님, 반갑습니다.`;
})