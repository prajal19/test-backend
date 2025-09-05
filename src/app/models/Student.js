import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  morningCarpool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carpool',
    default: null,
  },
  eveningCarpool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carpool',
    default: null,
  },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);