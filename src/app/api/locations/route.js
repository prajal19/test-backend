import dbConnect from "@/app/lib/dbConnect";
import Location from "@/app/models/Location";

export async function POST(req) {
  await dbConnect();
  const { userId, lng, lat } = await req.json();

  const location = await Location.create({
    user: userId,
    coordinates: { type: "Point", coordinates: [lng, lat] },
  });

  return Response.json(location);
}

export async function GET() {
  await dbConnect();
  const locations = await Location.find().populate("user");
  return Response.json(locations);
}
