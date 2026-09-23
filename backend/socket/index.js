const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { isTeamMember } = require('../utils/teamAccess');

let io = null;

const roomName = (projectId) => `project:${projectId}`;

// Initializes Socket.IO on the given HTTP server. Returns the io instance.
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL },
  });

  // Handshake authentication — verify JWT and attach the user to the socket.
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization || '').replace(/^Bearer /, '');

    if (!token) return next(new Error('Not authorized — no token provided'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { userId: decoded.userId, role: decoded.role };
      return next();
    } catch (err) {
      return next(new Error('Not authorized — token is invalid or expired'));
    }
  });

  io.on('connection', (socket) => {
    // Join a project room after verifying team membership.
    socket.on('join_project', async ({ projectId } = {}, ack) => {
      try {
        if (!mongoose.isValidObjectId(projectId)) {
          return typeof ack === 'function' && ack({ ok: false, message: 'Project not found' });
        }
        const project = await Project.findById(projectId);
        if (!project) {
          return typeof ack === 'function' && ack({ ok: false, message: 'Project not found' });
        }
        if (!isTeamMember(project, socket.user.userId)) {
          socket.emit('error_event', { message: 'Access denied — project team members only' });
          return typeof ack === 'function' && ack({ ok: false, message: 'Access denied' });
        }
        socket.join(roomName(projectId));
        return typeof ack === 'function' && ack({ ok: true });
      } catch (err) {
        return typeof ack === 'function' && ack({ ok: false, message: 'Server error' });
      }
    });

    socket.on('leave_project', ({ projectId } = {}) => {
      if (projectId) socket.leave(roomName(projectId));
    });
  });

  return io;
};

// Accessor for other modules (e.g. messageController) to emit events.
const getIo = () => io;

module.exports = { initSocket, getIo, roomName };
