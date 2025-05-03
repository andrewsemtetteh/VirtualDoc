import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitAppointmentUpdate = (appointment) => {
  if (!io) return;
  
  // Emit to the specific doctor
  io.to(`doctor_${appointment.doctorId}`).emit('appointmentUpdate', appointment);
  
  // Emit to the specific patient
  io.to(`patient_${appointment.patientId}`).emit('appointmentUpdate', appointment);
};

export const emitDoctorUpdate = (doctorId, data) => {
  if (!io) return;
  io.to(`doctor_${doctorId}`).emit('doctorUpdate', data);
};

export const emitPatientUpdate = (patientId, data) => {
  if (!io) return;
  io.to(`patient_${patientId}`).emit('patientUpdate', data);
}; 