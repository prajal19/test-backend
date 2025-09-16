import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    currentLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    endLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ride || mongoose.model("Ride", rideSchema);
