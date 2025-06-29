let serverSocket = null;
let roomSocket = null;
let currentRoomId = null;

function setupServerSocketHandlers(sock) {
  sock.on('connect', () => {
    console.log('Connected to main server');
    sock.emit('getRooms');
  });

  sock.on('msg', (msg) => {
    appendMessage(msg, 'Server');
  });

  sock.on('roomList', (rooms) => {
    renderRoomButtons(rooms);
  });

  sock.on('roomJoined', ({ roomId }) => {
    joinRoom(roomId);
  });
}

function setupRoomSocketHandlers(sock) {
  sock.on('connect', () => {
    console.log(`Connected to room ${currentRoomId}`);

    sock.emit('join', { role: 'player' });
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

  // Add other room-specific event handlers here
}

function appendMessage(msg, prefix = '') {
  const chatbox = document.getElementById('chatbox');
  const msgElem = document.createElement('div');
  msgElem.textContent = prefix ? `[${prefix}] ${msg}` : msg;
  chatbox.appendChild(msgElem);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function renderRoomButtons(rooms) {
  const container = document.getElementById('join-buttons');
  container.innerHTML = '';
  rooms.forEach(({ roomId, players, audience, status }) => {
    const btn = document.createElement('button');
    btn.textContent = `Room ${roomId} (${players} players, ${audience} audience) [${status}]`;
    btn.onclick = () => {
      if (currentRoomId === roomId) {
        alert(`Already in room ${roomId}`);
      } else {
        console.log(`Attempting to join room ${roomId}`);
        serverSocket.emit('joinRoom', { roomId, role: 'player' });
      }
    };
    container.appendChild(btn);
    container.appendChild(document.createElement('br'));
  });
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
  serverSocket = io(); // connect to main server namespace
  setupServerSocketHandlers(serverSocket);

  document.getElementById('send').addEventListener('click', () => {
    const msg = document.getElementById('chat').value;
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
