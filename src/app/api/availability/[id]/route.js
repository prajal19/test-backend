import dbConnect from "@/app/lib/dbConnect";
import Availability from "@/app/models/Availability";

// Get the ID from the URL
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const id = req.nextUrl.pathname.split("/").pop();// ✅ This is how you get [id]
    const availability = await Availability.findById(id)
      .populate("parent", "name email")
      .populate("group", "name location");

    if (!availability) {
      return new Response(JSON.stringify({ error: "Availability not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(availability), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updates = await req.json();

    const availability = await Availability.findByIdAndUpdate(id, updates, { new: true })
      .populate("parent", "name email")
      .populate("group", "name location");

    if (!availability) {
      return new Response(JSON.stringify({ error: "Availability not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(availability), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const availability = await Availability.findByIdAndDelete(id);
    if (!availability) {
      return new Response(JSON.stringify({ error: "Availability not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Availability deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
