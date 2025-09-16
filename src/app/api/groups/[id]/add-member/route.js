import dbConnect from "@/app/lib/dbConnect";
import Group from "@/app/models/Group";
import User from "@/app/models/User";
import mongoose from "mongoose";


export async function PATCH(req, { params }) {
  await dbConnect();
  const { id } = params; // group ID
  const { memberId, requesterId } = await req.json(); // memberId = user to add, requesterId = who is calling

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

    // 3️⃣ Only creator can add members
    if (group.creator._id.toString() !== requesterId) {
      return new Response(JSON.stringify({ error: "Only the creator can add members" }), { status: 403 });
    }

    // 4️⃣ Check if user to add exists
    const user = await User.findById(memberId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // 5️⃣ Prevent adding creator again
    if (group.creator._id.toString() === memberId) {
      return new Response(JSON.stringify({ error: "Cannot add the creator as a member" }), { status: 400 });
    }

    // 6️⃣ Prevent adding same member twice
    if (group.members.some(m => m._id.toString() === memberId)) {
      return new Response(JSON.stringify({ error: "User is already a member" }), { status: 400 });
    }

    // ✅ Add member
    group.members.push(memberId);
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