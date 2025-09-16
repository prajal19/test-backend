import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    meta: {
      speed: Number,
      heading: Number,
    },
  },
  { timestamps: true }
);

locationSchema.index({ coordinates: "2dsphere" });

export default mongoose.models.Location ||
  mongoose.model("Location", locationSchema);
