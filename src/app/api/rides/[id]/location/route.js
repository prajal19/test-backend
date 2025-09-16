import dbConnect from "@/app/lib/dbConnect";
import Ride from "@/app/models/Ride";
import Location from "@/app/models/Location";

export async function PUT(req, { params }) {
  await dbConnect();
  const id = params.id; // ride id
  const { lng, lat, driverId } = await req.json();

  if (!driverId) {
    return new Response(JSON.stringify({ error: "driverId is required" }), { status: 400 });
  }

  const location = await Location.create({
    user: driverId,
    coordinates: { type: "Point", coordinates: [lng, lat] },
  });

  const ride = await Ride.findByIdAndUpdate(
    id,
    { currentLocation: location._id },
    { new: true }
  ).populate("currentLocation");

  return Response.json(ride);
}
