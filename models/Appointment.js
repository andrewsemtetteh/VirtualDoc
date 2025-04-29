import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  notes: String,
  rescheduleReason: String,
  rescheduleHistory: [{
    oldDate: String,
    oldTime: String,
    newDate: String,
    newTime: String,
    reason: String,
    changedBy: {
      type: String,
      enum: ['patient', 'doctor']
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videoLink: String,
  diagnosis: String,
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment; 