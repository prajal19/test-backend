// import mongoose from "mongoose";

// const GroupSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true }, // e.g. "Group-001"
//     parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parent" }],
//     center: {
//       type: { type: String, enum: ["Point"], default: "Point", required: true },
//       coordinates: { type: [Number], required: true } // [lng, lat]
//     },
//     radiusMeters: { type: Number, default: 1500 }, // 1.5 km default
//     dutyIndex: { type: Number, default: 0 } // for future round-robin
//   },
//   { timestamps: true }
// );

// GroupSchema.index({ center: "2dsphere" });

// export default mongoose.models.Group || mongoose.model("Group", GroupSchema);








import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model('Group', groupSchema);
