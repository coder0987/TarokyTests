let serverSocket = null;
let roomSocket = null;
let currentRoomId = null;

function getUserId() {
  let userId = localStorage.getItem("userId");
  return userId;
}

function setUserId(id) {
  localStorage.setItem("userId", id);
}

function setupServerSocketHandlers(sock) {
  sock.on("connect", () => {
    console.log("Connected to main server");
    sock.emit("getRooms");
  });

  sock.on("assignUserId", (id) => {
    setUserId(id);
  });

  sock.on("rejoinRoom", ({ roomId }) => {
    // Automatically rejoin the previous room
    if (roomId) {
      joinRoom(roomId);
    }
  });

  sock.on("msg", (msg) => {
    appendMessage(msg, "Server");
  });

  sock.on("roomList", (rooms) => {
    renderRoomButtons(rooms);
  });

  sock.on("roomJoined", ({ roomId }) => {
    joinRoom(roomId);
    serverSocket.emit("getRooms");
  });

  sock.on("leftRoom", ({ roomId }) => {
    if (roomSocket) {
      roomSocket.disconnect();
      roomSocket = null;
    }
    currentRoomId = null;
    document.getElementById("room-id").textContent = "None";
    // Optionally clear chat/messages if you want
    // document.getElementById('chatbox').innerHTML = '';
    // Request the updated room list from the server
    serverSocket.emit("getRooms");
    // Do NOT call renderRoomButtons([]) here!
  });
}

function setupRoomSocketHandlers(sock) {
  sock.on('connect', () => {
    console.log(`Connected to room ${currentRoomId}`);
  });

  sock.on('msg', (msg) => {
    appendMessage(msg, `Room ${currentRoomId}`);
  });

  sock.on('disconnect', () => {
    console.log(`Disconnected from room ${currentRoomId}`);
    currentRoomId = null;
    roomSocket = null;
    document.getElementById('room-id').textContent = 'None';
  });

  sock.on("leftRoom", ({ roomId }) => {
    // Clean up client state/UI
    if (roomSocket) {
      roomSocket.disconnect();
      roomSocket = null;
    }
    currentRoomId = null;
    document.getElementById("room-id").textContent = "None";
    // Optionally clear chat/messages if you want
    // document.getElementById('chatbox').innerHTML = '';
    // Re-enable room buttons and hide leave button
    serverSocket.emit("getRooms"); // Refresh room list/buttons
    renderRoomButtons([]); // Or call with the latest room list if you have it
  });
}

function appendMessage(msg, prefix = '') {
  const chatbox = document.getElementById('chatbox');
  const msgElem = document.createElement('div');
  msgElem.textContent = prefix ? `[${prefix}] ${msg}` : msg;
  chatbox.appendChild(msgElem);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function renderRoomButtons(rooms) {
  const container = document.getElementById("join-buttons");
  container.innerHTML = "";
  rooms.forEach(({ roomId, players, audience, status }) => {
    const btn = document.createElement("button");
    btn.textContent = `Room ${roomId} (${players} players, ${audience} audience) [${status}]`;
    btn.onclick = () => {
      if (currentRoomId === roomId) {
        alert(`Already in room ${roomId}`);
      } else {
        console.log(`Attempting to join room ${roomId}`);
        serverSocket.emit("joinRoom", { roomId, role: "player" });
      }
    };
    btn.disabled = !!currentRoomId;
    container.appendChild(btn);
    container.appendChild(document.createElement("br"));
  });
  // Add leave room button if in a room
  let leaveBtn = document.getElementById("leave-room-btn");
  if (!leaveBtn) {
    leaveBtn = document.createElement("button");
    leaveBtn.id = "leave-room-btn";
    leaveBtn.textContent = "Leave Room";
    leaveBtn.onclick = () => {
      if (currentRoomId) {
        serverSocket.emit("leaveRoom", { roomId: currentRoomId });
        if (roomSocket) {
          roomSocket.disconnect();
          roomSocket = null;
        }
        currentRoomId = null;
        document.getElementById("room-id").textContent = "None";
        renderRoomButtons([]); // Refresh buttons
      }
    };
    container.appendChild(leaveBtn);
  }
  leaveBtn.style.display = currentRoomId ? "inline-block" : "none";
}

function joinRoom(roomId) {
  // If already connected to a room, disconnect first
  console.log('Connecting socket to room ' + roomId);

  if (roomSocket) {
    console.log('Disconnecting old socket')
    roomSocket.disconnect();
    roomSocket = null;
  }

  currentRoomId = roomId;
  document.getElementById('room-id').textContent = roomId;

  console.log('connecting new socket');
  console.log(`/room/${roomId}/socket.io/`)
  // Connect new socket specifically for the room namespace
  roomSocket = io({ path: `/room/${roomId}/socket.io/` });
  setupRoomSocketHandlers(roomSocket);
}

window.onload = () => {
  const userId = getUserId();
  serverSocket = io({ query: { userId } }); // send userId to server
  setupServerSocketHandlers(serverSocket);

  document.getElementById("send").addEventListener("click", () => {
    const msg = document.getElementById("chat").value;
    sendMsg(msg);
  });
};

function sendMsg(msg) {
  // Prefer sending to roomSocket if connected, else to serverSocket

  console.log('Sending message ' + msg);

  if (roomSocket && currentRoomId) {
    roomSocket.emit('msg', msg);
  } else if (serverSocket) {
    serverSocket.emit('msg', msg);
  } else {
    alert('No active connection to send message');
  }
}
