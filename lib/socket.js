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
    console.log('Client connected:', socket.id);

    // Join user's room for private messages
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
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