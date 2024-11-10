import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8442';

let token = localStorage.getItem('token');
if (!token) {
  token = (Math.random() * 1000000000000000000);
  localStorage.setItem('token', token);
}

export const socket = io(URL, {
    auth: {
        token: token
    }
});