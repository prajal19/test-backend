import dbConnect from "@/app/lib/dbConnect";
import Ride from "@/app/models/Ride";
import { authenticate } from "@/app/lib/auth";

export async function PATCH(req, { params }) {
  await dbConnect();
  const userId = authenticate(req);
  const { id } = params;
  const { status } = await req.json();

  if (!["scheduled", "in-progress", "completed"].includes(status)) {
    return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
  }

  const ride = await Ride.findById(id);
  if (!ride) return new Response(JSON.stringify({ error: "Ride not found" }), { status: 404 });
  if (ride.driver.toString() !== userId) {
    return new Response(JSON.stringify({ error: "Only the driver can update the ride" }), { status: 403 });
  }

  ride.status = status;
  await ride.save();
  return new Response(JSON.stringify(ride), { status: 200 });
}



