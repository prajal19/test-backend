import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  date: { type: Date, required: true },
  type: { type: String, enum: ['morning', 'evening'], required: true },
  pickDrop: { type: Boolean, default: false }, // whether they picked/dropped
  childName: { type: String },
}, { timestamps: true });

export default mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
