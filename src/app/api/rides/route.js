import dbConnect from "@/app/lib/dbConnect";
import Ride from "@/app/models/Ride";

export async function POST(req) {
  await dbConnect();
  const { groupId, driverId, childrenIds, startLocationId } = await req.json();

  const ride = await Ride.create({
    group: groupId,
    driver: driverId,
    children: childrenIds,
    startLocation: startLocationId,
    currentLocation: startLocationId,
    status: "in-progress",
  });

  return Response.json(ride);
}

export async function GET() {
  await dbConnect();
  const rides = await Ride.find().populate("driver").populate("group").populate("currentLocation");
  return Response.json(rides);
}
