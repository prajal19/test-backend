import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['morning', 'evening'], required: true },
    notes: { type: String },
    childName: { type: String },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);


