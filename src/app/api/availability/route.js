import dbConnect from "@/app/lib/dbConnect";
import Availability from "@/app/models/Availability";

export async function POST(req) {
  await dbConnect();
  const { parent, group, date, type, childName } = await req.json();

  if (!['morning', 'evening'].includes(type)) {
    return new Response(JSON.stringify({ error: "Type must be 'morning' or 'evening'" }), { status: 400 });
  }

  const availability = await Availability.create({ parent, group, date, type, childName });
  return new Response(JSON.stringify(availability), { status: 201 });
}





export async function GET() {
  try {
    await dbConnect();
    // Fetch all availability entries
    const availabilities = await Availability.find()
      .populate("parent", "name email")   // populate parent details if it's a ref
      .populate("group", "name location"); // populate group details if it's a ref

    return new Response(JSON.stringify(availabilities), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}



