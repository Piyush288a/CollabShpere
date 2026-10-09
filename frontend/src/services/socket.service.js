import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants/api.constants';

let socket = null;

export const socketService = {
  connect(token) {
    if (socket && socket.connected) return socket;

    socket = io(SOCKET_URL, {
      query: { token },
      auth: { token },
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  joinProject(projectId, callback) {
    if (!socket) return;
    socket.emit('join_project', { projectId }, callback);
  },

  leaveProject(projectId) {
    if (!socket) return;
    socket.emit('leave_project', { projectId });
  },

  onNewMessage(callback) {
    if (!socket) return;
    socket.on('message:new', callback);
  },

  offNewMessage(callback) {
    if (!socket) return;
    socket.off('message:new', callback);
  },

  getSocket() {
    return socket;
  },
};
