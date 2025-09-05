import mongoose from 'mongoose';

const carpoolSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    pickupTime: String,
    dropoffTime: String,
    status: {
      type: String,
      enum: ['scheduled', 'picked-up', 'dropped-off'],
      default: 'scheduled',
    },
  }],
  maxCapacity: {
    type: Number,
    default: 4,
  },
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.Carpool || mongoose.model('Carpool', carpoolSchema);