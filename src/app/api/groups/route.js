


import dbConnect from "@/app/lib/dbConnect";
import Group from "@/app/models/Group";
import User from "@/app/models/User";
import Availability from "@/app/models/Availability";
import { NextResponse } from "next/server";








// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { name, parentId } = await req.json();

//     // 0. Check if this parent already created or is in a group
//     const existingGroup = await Group.findOne({
//       $or: [
//         { creator: parentId }, // already creator
//         { members: parentId }, // already member
//       ],
//     });

//     if (existingGroup) {
//       return NextResponse.json(
//         { error: "Parent is already part of another group" },
//         { status: 400 }
//       );
//     }

//     // 1. Find creator (parent creating the group)
//     const creator = await User.findById(parentId);
//     if (
//       !creator ||
//       !creator.car?.capacity ||
//       !creator.location?.coordinates?.length ||
//       !creator.children ||
//       creator.children.length === 0
//     ) {
//       return NextResponse.json(
//         { error: "Parent not eligible (missing details)" },
//         { status: 400 }
//       );
//     }

//     // 2. Calculate available seats
//     let availableSeats = creator.car.capacity - 1; // 1 seat reserved for creator
//     if (availableSeats <= 0) {
//       return NextResponse.json(
//         { error: "No seats available in car" },
//         { status: 400 }
//       );
//     }

//     // 3. Creator's children take seats
//     if (creator.children.length > availableSeats) {
//       return NextResponse.json(
//         { error: "Not enough seats for creator's own children" },
//         { status: 400 }
//       );
//     }
//     availableSeats -= creator.children.length;

//     // Members list starts with creator
//     let members = [creator._id];

//     // 4. Find nearby eligible parents
//     const nearbyParents = await User.find({
//       _id: { $ne: creator._id },
//       "children.0": { $exists: true }, // must have at least 1 child
//       location: {
//         $near: {
//           $geometry: creator.location,
//           $maxDistance: 2000, // 2 km
//         },
//       },
//       groupId: { $exists: false }, // not already in any group
//     });

//     // 5. Try to add parents with the new rule
//     for (let parent of nearbyParents) {
//       if (availableSeats <= 0) break;

//       const childCount = parent.children.length;

//       // Check if creator’s remaining seats can fit this parent's children
//       if (childCount <= availableSeats) {
//         // New Rule: all parents must be able to carry all children + 1 driver
//         const totalChildren = creator.children.length + members.length - 1; // creator's children
//         const currentMembers = await User.find({ _id: { $in: members } });
//         const totalGroupChildren =
//           currentMembers.reduce((sum, p) => sum + p.children.length, 0) +
//           childCount;

//         const allParents = [...members, parent._id];
//         const parents = await User.find({ _id: { $in: allParents } });

//         let valid = true;
//         for (let p of parents) {
//           if (p.car.capacity < totalGroupChildren + 1) {
//             valid = false;
//             break;
//           }
//         }

//         if (valid) {
//           members.push(parent._id);
//           availableSeats -= childCount;
//         }
//       }
//     }

//     // 6. Prevent group creation if no eligible members added (only creator)
//     if (members.length === 1) {
//       return NextResponse.json(
//         { error: "No eligible members found to fill the group" },
//         { status: 400 }
//       );
//     }

//     // 7. Create group
//     const group = await Group.create({
//       name,
//       creator: creator._id,
//       members,
//       location: creator.location,
//     });

//     // 8. Update each member's groupId (creator + members)
//     await User.updateMany(
//       { _id: { $in: members } },
//       { $set: { groupId: group._id } }
//     );

//     return NextResponse.json(group, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { name, parentId } = await req.json();

//     // 0. Check if this parent already created or is in a group
//     const existingGroup = await Group.findOne({
//       $or: [
//         { creator: parentId }, // already creator
//         { members: parentId }, // already member
//       ],
//     });

//     if (existingGroup) {
//       return NextResponse.json(
//         { error: "Parent is already part of another group" },
//         { status: 400 }
//       );
//     }

//     // 1. Find creator (parent creating the group)
//     const creator = await User.findById(parentId);
//     if (
//       !creator ||
//       !creator.car?.capacity ||
//       !creator.children ||
//       creator.children.length === 0
//     ) {
//       return NextResponse.json(
//         { error: "Parent not eligible (missing details)" },
//         { status: 400 }
//       );
//     }

//     // 2. Calculate available seats for creator's children
//     let availableSeats = creator.car.capacity - 1; // 1 seat reserved for creator
//     if (availableSeats < 0) {
//       return NextResponse.json(
//         { error: "No seats available in car" },
//         { status: 400 }
//       );
//     }

//     if (creator.children.length > availableSeats) {
//       return NextResponse.json(
//         { error: "Not enough seats for creator's own children" },
//         { status: 400 }
//       );
//     }
//     availableSeats -= creator.children.length;

//     // 3. Members list starts with creator
//     let members = [creator._id];

//     // 4. Prepare group data
//     const groupData = {
//       name,
//       creator: creator._id,
//       members,
//     };

//     // only add location if it exists
//     if (creator.location) {
//       groupData.location = creator.location;
//     }

//     // 5. Create group
//     const group = await Group.create(groupData);

//     // 6. Update creator's groupId
//     await User.findByIdAndUpdate(creator._id, { groupId: group._id });

//     return NextResponse.json(group, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }




// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const parentId = searchParams.get("parentId"); // get parentId from query

//     if (!parentId) {
//       return new Response(
//         JSON.stringify({ error: "parentId is required" }),
//         { status: 400 }
//       );
//     }

//     // Find groups where parent is either the creator or a member
//     const groups = await Group.find({
//       $or: [
//         { creator: parentId },
//         { members: parentId }
//       ]
//     }).populate("members", "name email location"); // populate members details

//     return new Response(JSON.stringify(groups), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }







// import dbConnect from "@/app/lib/dbConnect";
// import Group from "@/app/models/Group";
// import User from "@/app/models/User";

export async function POST(req) {
  await dbConnect();
  const { name, creatorId } = await req.json();

  const group = await Group.create({ name, creator: creatorId, members: [creatorId] });

  return Response.json(group);
}

export async function GET() {
  await dbConnect();
  const groups = await Group.find().populate("creator").populate("members");
  return Response.json(groups);
}
