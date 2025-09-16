import dbConnect from "@/app/lib/dbConnect";
import Group from "@/app/models/Group";
import User from "@/app/models/User";
import Location from "@/app/models/Location";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
//   const { id } = req.nextUrl.params;
const id = req.nextUrl.pathname.split("/").pop();

  const user = await User.findById(id).select("-password");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}










// export async function PATCH(req) {
//   await dbConnect();
  
//   const id = req.nextUrl.pathname.split("/").pop(); // get dynamic id from URL
//   const data = await req.json();

//   // Only allow name and location to be updated
//   const updateData = {};
//   if (data.name) updateData.name = data.name;
//   if (data.location) updateData.location = data.location;

//   const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  
//   if (!updatedUser) 
//     return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

//   return new Response(JSON.stringify(updatedUser), { status: 200 });
// }





// export async function PATCH(req, { params }) {
//   await dbConnect();
//   const { id } = params; // userId from URL
//   const { name, latitude, longitude } = await req.json();

//   const updateData = {};

//   if (name) updateData.name = name;
//   if (latitude !== undefined && longitude !== undefined) {
//     updateData.location = { type: "Point", coordinates: [longitude, latitude] };
//   }

//   const user = await User.findByIdAndUpdate(id, updateData, { new: true });

//   if (!user) {
//     return new Response(JSON.stringify({ error: "User not found" }), {
//       status: 404,
//     });
//   }

//   return new Response(JSON.stringify(user), { status: 200 });
// }









export async function PATCH(req, { params }) {
  await dbConnect();
  const { id } = params; // User ID from URL
  const { car, children, phone, name } = await req.json(); // Update car, children, and phone

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        ...(car && { car }),
        ...(children && { children }),
        ...(phone && { phone }),
        ...(name && { name }),
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}












export async function DELETE(req) {
  await dbConnect();
const id = req.nextUrl.pathname.split("/").pop();

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
}





// DELETE /api/users/[id]
// export async function DELETE(req, { params }) {
//   await dbConnect();
//   const { id } = params; // User ID from URL
//   const { childId } = await req.json(); // only childId from body

//   const user = await User.findByIdAndUpdate(
//     id,
//     { $pull: { children: { _id: childId } } },
//     { new: true }
//   );

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json(user, { status: 200 });
// }








