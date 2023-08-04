const socket = io(); //백엔드 socket.io 서버를 찾아서 연결해줌.

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const nick = document.getElementById("nick");
const nickForm = nick.querySelector("form");
const room = document.getElementById("room");
const msgForm = room.querySelector("form");

let roomName, nickName;

document.querySelector(".change-nick").addEventListener("click", async (event)=>{
    const { value: nick } = await Swal.fire({
        title: '닉네임 변경',
        input: 'text',
        // inputLabel: '닉네임',
        inputPlaceholder: '닉네임을 입력하세요.',
        inputValidator: (value)=>{
            if(!value){
                return "닉네임을 입력해주세요!"
            }
        }
      })
      
    if (nick) {
        event.preventDefault();
        nickName = nick;
        document.querySelector("header p").innerText =`닉네임 : ${nickName}`;
    }
})

nickForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const inputnick = nickForm.querySelector("input");
    nickName = inputnick.value;
    inputnick.value = "";
    nick.style.display="none";
    welcome.style.display="";
    welcome.querySelector("#roomname").focus();
    document.querySelector("header p").innerText =`닉네임 : ${nickName}`;
    document.querySelector("header button").style.display = "";
})

msgForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const inputmsg = msgForm.querySelector("input");
    socket.emit("message", inputmsg.value, roomName, (msg)=>{
        addMessage(null, msg, "me");
    });
    inputmsg.value = "";
    inputmsg.focus();
})

welcomeForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const inputroom = document.getElementById("roomname");
    roomName = inputroom.value;

    socket.emit("enter_room", nickName, roomName, ()=>{
        welcome.style.display = "none";
        room.style.display = "";
        document.querySelector(".change-nick").style.display = "none";
        const h3 = room.querySelector("h3");
        h3.innerText = roomName;
        inputroom.value = "";
        room.querySelector("#chat_list").innerHTML = "";
        room.querySelector("input").focus();
        addMessage(null, "건전한 채팅문화를 위해 비속어 사용을 자제해주세요.", "system");
    }); //emit(이벤트명, 데이터(개수에 제약없음), 서버측에 넘겨줄 콜백함수(호출은 서버에서 하지만 실행은 클라이언트에서 됨))
    //서버측에서 처리 후 서버로부터 파라미터를 넘겨받아서 콜백함 수 실행가능
});

function addMessage(nick, msg, who) {
    const chat_list = room.querySelector("#chat_list");
    const chat = document.createElement("div");
    if(who==="you"){
        chat.innerHTML=`<div>${nick}</div>`;
    }
    chat.innerHTML+=`<p>${msg}</p>`

    chat.classList.add(`chat-${who}`);
    chat_list.appendChild(chat);
    chat_list.scrollTop = chat_list.scrollHeight;
}

function showRoomList() {
    Swal.fire({
        title: '채팅방을 나가시겠습니까?',
        text: "현재 채팅내용은 사라집니다.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '나가기',
        cancelButtonText: "취소"
      }).then((result) => {
        if (result.isConfirmed) {
            socket.emit("leave_room", roomName, ()=>{
                room.style.display="none";
                welcome.style.display="";
                welcome.querySelector("#roomname").focus();
                document.querySelector(".change-nick").style.display = "";
            })
        }
      })
}

socket.on("welcome-msg", (nickname, usr_cnt)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `${roomName} (${usr_cnt}명)`;
    addMessage(null, `${nickname}님이 입장하셨습니다.`, "system");
});

socket.on("bye", (nickname, usr_cnt)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `${roomName} (${usr_cnt}명)`;
    addMessage(null, `${nickname}님이 퇴장하셨습니다.`, "system")
});

socket.on("message", (nickname, msg)=>addMessage(nickname, msg, "you"));

socket.on("room_change", (roomList)=>{
    const room_list_body = welcome.querySelector("tbody");
    room_list_body.innerHTML = "";
    roomList.forEach((room_info, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML=`<th scope="col">${idx+1}</th>\n<th scope="col">${room_info.room}</th>\n<th scope="col">${room_info.usr_cnt}명</th>`;
        room_list_body.appendChild(tr);
    });
});