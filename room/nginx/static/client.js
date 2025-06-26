const socket = io();

let currentRoomId = null;

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('getRooms');
});

// Display incoming chat messages
socket.on('msg', (msg) => {
  const chatbox = document.getElementById('chatbox');
  const msgElem = document.createElement('div');
  msgElem.textContent = msg;
  chatbox.appendChild(msgElem);
  chatbox.scrollTop = chatbox.scrollHeight; // auto-scroll down
});

// Render list of rooms as buttons
socket.on('roomList', (rooms) => {
  const container = document.getElementById('join-buttons');
  container.innerHTML = ''; // clear old buttons

  rooms.forEach(({ roomId, players, audience, status }) => {
    const btn = document.createElement('button');
    btn.textContent = `Room ${roomId} (${players} players, ${audience} audience) [${status}]`;
    btn.onclick = () => joinRoom(roomId);
    container.appendChild(btn);
  });
});

// Handle successful join
socket.on('roomJoined', ({ roomId }) => {
  currentRoomId = roomId;
  document.getElementById('room-id').textContent = roomId;
  console.log(`Joined room: ${roomId}`);
});

// Join a room by emitting to server
function joinRoom(roomId) {
  if (currentRoomId === roomId) {
    alert(`Already in room ${roomId}`);
    return;
  }
  socket.emit('joinRoom', { roomId, role: 'player' });
}

// Optional: join first room automatically on load (comment out if manual join desired)
// socket.on('roomList', (rooms) => {
//   if (rooms.length > 0) joinRoom(rooms[0].roomId);
// });
