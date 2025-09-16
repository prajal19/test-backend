import dbConnect from "@/app/lib/dbConnect";
import Group from "@/app/models/Group";
import User from "@/app/models/User";
import Availability from "@/app/models/Availability";
import Ride from "@/app/models/Ride";
import Location from "@/app/models/Location";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticate } from "@/app/lib/auth";

// // Get group by ID
// export async function GET(req, { params }) {
//   await dbConnect();
//   const { id } = params;

//   const group = await Group.findById(id).populate("members", "name email location");
//   if (!group) {
//     return NextResponse.json({ error: "Group not found" }, { status: 404 });
//   }
//   return NextResponse.json(group, { status: 200 });
// }






export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // groupId from URL
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // optional
    const type = searchParams.get("type"); // optional

    // 1. Find the group with members
    const group = await Group.findById(id).populate("members", "name email");
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // 2. If no date/type filter → return all members
    if (!date && !type) {
      return NextResponse.json(group, { status: 200 });
    }

    // 3. Build availability query
    let query = { group: id };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    if (type) query.type = type;

    // 4. Find availabilities for this group (date & type)
    const availabilities = await Availability.find(query).populate("parent", "firstname lastname email");

    // 5. Get only available members
    const availableMembers = availabilities.map(a => ({
      _id: a.parent._id,
      firstname: a.parent.firstname,
      lastname: a.parent.lastname,
      email: a.parent.email,
      availability: {
        date: a.date,
        type: a.type,
        childName: a.childName,
        pickDrop: a.pickDrop,
      }
    }));

    // 6. Return group + available members
    return NextResponse.json({
      _id: group._id,
      name: group.name,
      location: group.location,
      driver: group.driver,
      availableMembers
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}





// Update group
export async function PATCH(req, { params }) {
  await dbConnect();
  const { id } = params;
  const data = await req.json();

  // Only allow updating certain fields
  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.location) updateData.location = data.location;
  if (data.members) updateData.members = data.members; // replace members

  const updatedGroup = await Group.findByIdAndUpdate(id, updateData, { new: true })
    .populate("members", "name email location");

  if (!updatedGroup) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(updatedGroup, { status: 200 });
}

// Delete group
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  const deletedGroup = await Group.findByIdAndDelete(id);
  if (!deletedGroup) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
}

// Assign driver for a date/type and create a ride
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const userId = authenticate(request); // requester must be member
    const { id } = params; // group id
    const { date, type, startLng, startLat } = await request.json();

    const group = await Group.findById(id).populate("members");
    if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

    if (!group.members.some(m => m._id.toString() === userId)) {
      return NextResponse.json({ error: "Only group members can assign rides" }, { status: 403 });
    }

    // Find available members for the given date/type
    const start = new Date(date); start.setHours(0,0,0,0);
    const end = new Date(date); end.setHours(23,59,59,999);
    const availabilities = await Availability.find({
      group: id,
      date: { $gte: start, $lte: end },
      type
    }).populate("parent");

    if (availabilities.length === 0)
      return NextResponse.json({ error: "No volunteers available" }, { status: 400 });

    // Pick first available parent (simple turn-taking based on availability only)
    const chosen = availabilities[0];

    // Create optional start location
    let startLocation = null;
    if (startLng !== undefined && startLat !== undefined) {
      startLocation = await Location.create({ user: chosen.parent._id, coordinates: { type: "Point", coordinates: [startLng, startLat] } });
    }

    // Create ride with all parents' children (for tracking)
    const ride = await Ride.create({
      group: group._id,
      driver: chosen.parent._id,
      children: members.map(m => m._id),
      startLocation: startLocation?._id,
      currentLocation: startLocation?._id,
      status: "in-progress"
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}







// export async function POST(req, context) {
//   try {
//     await dbConnect();

//     const { params } = context;
//     const groupId = params.id;
//     const { parentId } = await req.json();

//     const group = await Group.findById(groupId);
//     if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

//     const parent = await User.findById(parentId);
//     if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

//     // Prevent adding creator or duplicate
//     if (parent._id.toString() === group.creator.toString()) {
//       return NextResponse.json({ error: "Cannot add creator as a member" }, { status: 400 });
//     }
//     if (group.members.map(m => m.toString()).includes(parent._id.toString())) {
//       return NextResponse.json({ error: "Parent is already in this group" }, { status: 400 });
//     }

//     // Other validations
//     if (!parent.car?.capacity || parent.car.capacity <= 0)
//       return NextResponse.json({ error: "Parent cannot be added: missing car capacity" }, { status: 400 });

//     if (!parent.children || parent.children.length === 0)
//       return NextResponse.json({ error: "Parent cannot be added: has no children" }, { status: 400 });

//     // Check total children capacity
//     // const members = await User.find({ _id: { $in: group.members } });
//     // const totalChildren = members.reduce((sum, m) => sum + (m.children?.length || 0), 0) + parent.children.length;

//     // const allMembers = [...members, parent];
//     // for (let m of allMembers) {
//     //   if (!m.car?.capacity || m.car.capacity < totalChildren + 1)
//     //     return NextResponse.json(
//     //       { error: `Cannot add ${parent.name}: not enough capacity in ${m.name}'s car` },
//     //       { status: 400 }
//     //     );
//     // }

//     // Add parent
//     group.members.push(parent._id);
//     await group.save();

//     parent.groupId = group._id;
//     await parent.save();

//     return NextResponse.json({ message: "Member added successfully", group }, { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }









