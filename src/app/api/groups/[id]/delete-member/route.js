import dbConnect from "@/app/lib/dbConnect";
import Group from "@/app/models/Group";
import User from "@/app/models/User";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params; // group ID
  const { memberId, requesterId } = await req.json(); // memberId = user to remove, requesterId = who is calling

  try {
    // 1️⃣ Validate inputs
    if (!memberId || !requesterId) {
      return new Response(JSON.stringify({ error: "memberId and requesterId are required" }), { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(memberId) || !mongoose.Types.ObjectId.isValid(requesterId)) {
      return new Response(JSON.stringify({ error: "Invalid memberId or requesterId" }), { status: 400 });
    }

    // 2️⃣ Check if group exists
    const group = await Group.findById(id).populate("creator").populate("members");
    if (!group) {
      return new Response(JSON.stringify({ error: "Group not found" }), { status: 404 });
    }

    // 3️⃣ Only creator can remove members
    if (group.creator._id.toString() !== requesterId) {
      return new Response(JSON.stringify({ error: "Only the creator can remove members" }), { status: 403 });
    }

    // 4️⃣ Prevent removing creator
    if (group.creator._id.toString() === memberId) {
      return new Response(JSON.stringify({ error: "Cannot remove the creator" }), { status: 400 });
    }

    // 5️⃣ Check if member exists in group
    if (!group.members.some(m => m._id.toString() === memberId)) {
      return new Response(JSON.stringify({ error: "User is not a member of this group" }), { status: 400 });
    }

    // ✅ Remove member
    group.members = group.members.filter(m => m._id.toString() !== memberId);
    await group.save();
    await group.populate([
  { path: "creator" },
  { path: "members" }
]);


    return new Response(JSON.stringify(group), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
