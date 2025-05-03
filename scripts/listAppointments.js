const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Check for required environment variables
if (!process.env.MONGODB_URI) {
  console.error('\nError: MONGODB_URI is not defined in .env.local file');
  console.log('\nPlease check your .env.local file in the root directory contains the MONGODB_URI variable');
  process.exit(1);
}

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  specialization: String
});

const User = mongoose.model('User', userSchema);

// Define the Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledFor: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Helper function to safely format dates
const formatDate = (date) => {
  if (!date) return 'Not specified';
  try {
    return new Date(date).toLocaleString();
  } catch (error) {
    return 'Invalid date';
  }
};

async function listAppointments() {
  let connection;
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!\n');

    // Fetch all appointments with patient and doctor details
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email specialization')
      .sort({ scheduledFor: 1 });

    if (appointments.length === 0) {
      console.log('No appointments found in the database.');
      return;
    }

    console.log(`Total appointments found: ${appointments.length}`);
    console.log('\nAppointment Details:');
    console.log('==================');

    appointments.forEach((appointment, index) => {
      console.log(`\nAppointment #${index + 1}:`);
      console.log('ID:', appointment._id);
      console.log('Patient:', appointment.patientId?.name || 'Unknown', `(${appointment.patientId?.email || 'No email'})`);
      console.log('Doctor:', appointment.doctorId?.name || 'Unknown', `(${appointment.doctorId?.email || 'No email'})`);
      console.log('Specialty:', appointment.doctorId?.specialization || 'Not specified');
      console.log('Scheduled For:', formatDate(appointment.scheduledFor));
      console.log('Status:', appointment.status || 'Not specified');
      console.log('Reason:', appointment.reason || 'Not specified');
      console.log('Created At:', formatDate(appointment.createdAt));
      console.log('Updated At:', formatDate(appointment.updatedAt));
      
      // Add raw data for debugging
      console.log('\nRaw Data:');
      console.log('scheduledFor:', appointment.scheduledFor);
      console.log('createdAt:', appointment.createdAt);
      console.log('updatedAt:', appointment.updatedAt);
      console.log('------------------');
    });

  } catch (error) {
    console.error('\nError occurred:');
    if (error.name === 'MongoServerError') {
      console.error('Failed to connect to MongoDB. Please check your connection string and ensure MongoDB is running.');
    } else {
      console.error(error.message);
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('\nDisconnected from MongoDB');
    }
  }
}

// Run the script
listAppointments(); 