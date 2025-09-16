import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const users = await User.find().select("-password"); // hide password
  return NextResponse.json(users);
}
