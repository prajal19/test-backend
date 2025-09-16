import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["group_invite", "ride_started", "ride_completed", "general"], default: "general" },
    message: { type: String, required: true },
    relatedRide: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);



