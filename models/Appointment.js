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
    default: 'pending',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  rescheduleReason: {
    type: String,
    required: false
  },
  rescheduleHistory: [{
    oldDate: {
      type: String,
      required: true
    },
    oldTime: {
      type: String,
      required: true
    },
    newDate: {
      type: String,
      required: true
    },
    newTime: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    changedBy: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  }],
  videoLink: {
    type: String,
    required: false
  },
  diagnosis: {
    type: String,
    required: false
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment; 