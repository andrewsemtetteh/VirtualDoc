import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  // Doctor specific fields
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  licenseNumber: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  yearsOfExperience: {
    type: Number,
    required: function() { return this.role === 'doctor'; }
  },
  // Patient specific fields
  dateOfBirth: {
    type: Date,
    required: function() { return this.role === 'patient'; }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() { return this.role === 'patient'; }
  },
  address: {
    type: String,
    required: function() { return this.role === 'patient'; }
  },
  // Common fields
  profileImage: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 