// The websocket object is created by the browser and is used to connect to the server.
// Think about it when the backend is not running on the same server as the frontend
// replace localhost with the server's IP address or domain name.
const socket = new WebSocket("ws://localhost:3000");
let username = "";
let userId = "";

// Listen for WebSocket open event
socket.addEventListener("open", (event) => {
  console.log("WebSocket connected.");
  // Send a dummy user to the backend
  const user = { id: 1, name: "John Doe" };
  const message = {
    type: "user",
    user,
  };
  socket.send(JSON.stringify(message));
});

const createMessage = (message) => {
  const jsonMessage = JSON.parse(message);
  if (jsonMessage.type !== "message") return;
  if (jsonMessage.user === username) {
    document.getElementById(
      "chatBox"
    ).innerHTML += `<div class="w-full flex justify-end mt-3">
                <div class="w-1/2">
                  <div class="flex items-center justify-end">
                    <p class="font-semibold mr-3 text-sm text-slate-600">
                      ${jsonMessage.user} <span class="text-slate-400 text-xs">${jsonMessage.date} - ${jsonMessage.time}</span>
                    </p>

                    <img
                      class="h-5 w-5 overflow-hidden rounded-full"
                      src="https://source.unsplash.com/random/500x500/?face"
                      alt=""
                    />
                  </div>

                  <div
                    class="mt-3 w-full bg-blue-500 p-4 rounded-b-xl rounded-tl-xl"
                  >
                    <p class="text-sm text-white">
                      ${jsonMessage.text}
                    </p>
                  </div>
                </div>
              </div>`;
  } else {
    document.getElementById(
      "chatBox"
    ).innerHTML += `<div class="w-full flex flex-start overflow-y-auto mt-3">
                <div class="w-1/2">
                  <div class="flex items-center justify-end">
                    <p class="font-semibold mr-3 text-sm text-slate-600">
                      ${jsonMessage.user} <span class="text-slate-400 text-xs">${jsonMessage.date} - ${jsonMessage.time}</span>
                    </p>

                    <img
                      class="h-5 w-5 overflow-hidden rounded-full"
                      src="https://source.unsplash.com/random/500x500/?face"
                      alt=""
                    />
                  </div>

                  <div
                    class="mt-3 w-full bg-slate-50 p-4 rounded-b-xl rounded-tr-xl"
                  >
                    <p class="text-sm text-slate-500">
                      ${jsonMessage.text}
                    </p>
                  </div>
                </div>
              </div>
    `;
  }
  // const messageBox = document.createElement("");
  // messageBox.textContent = message;
  // document.getElementById("messages").appendChild(p);
};

// Listen for messages from server
socket.addEventListener("message", (event) => {
  console.log(`Received message: ${event.data}`);
  createMessage(event.data);
});

// Listen for WebSocket close event
socket.addEventListener("close", (event) => {
  console.log("WebSocket closed.");
});

// Listen for WebSocket errors
socket.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUsername = document.getElementById("loggedInUser");

  const token = localStorage.getItem("token");
  const response = await fetch("/api/userInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    if (data?.username) {
      loggedInUsername.innerHTML = data.username;
      username = data.username;
      userId = data.userId;

      const messageResponse = await fetch("/api/getMessages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (messageResponse.status === 200) {
        const messages = await messageResponse.json();
        messages.forEach((message) => {
          const messageToSend = {
            type: "message",
            user: message.username,
            text: message.msgText,
            date: message.date,
            time: message.time,
          };
          socket.send(JSON.stringify(messageToSend));
        });
      }
    } else {
      errorText.innerText = data;
    }
  } else {
    window.location.href = "/login";
  }

  document
    .getElementById("editUsername")
    .addEventListener("click", async () => {
      const newUsername = document.getElementById("changeUsername").value;
      const response = await fetch("/api/updateUsername", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername }),
      });
      if (response.status === 200) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });

  document
    .getElementById("btnSendHello")
    .addEventListener("click", async () => {
      const messageInput = document.getElementById("inptMessage").value;
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const hour = currentDate.getHours();
      const minute = currentDate.getMinutes();
      const date = `${day}/${month}/${year}`;
      const time = `${hour}:${minute}`;
      const message = {
        type: "message",
        user: username,
        text: messageInput,
        date: date,
        time: time,
      };
      socket.send(JSON.stringify(message));
      const token = localStorage.getItem("token");
      const response = await fetch("/api/saveMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageInput, date, time }),
      });
    });
});
