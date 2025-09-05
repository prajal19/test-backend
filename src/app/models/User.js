import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  carDetails: {
    make: String,
    model: String,
    color: String,
    licensePlate: String,
  },
  isAvailable: {
    morning: { type: Boolean, default: false },
    evening: { type: Boolean, default: false },
  },
  role: {
    type: String,
    enum: ['parent', 'admin'],
    default: 'parent',
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);