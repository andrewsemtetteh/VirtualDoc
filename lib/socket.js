import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Join a room for doctor updates
    socket.on('join:doctors', () => {
      socket.join('doctors');
    });

    // Leave the doctors room
    socket.on('leave:doctors', () => {
      socket.leave('doctors');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Helper function to emit doctor updates
export const emitDoctorUpdate = (doctor) => {
  if (io) {
    io.to('doctors').emit('doctor:update', doctor);
  }
};

// Helper function to emit new doctor
export const emitNewDoctor = (doctor) => {
  if (io) {
    io.to('doctors').emit('doctor:new', doctor);
  }
}; 