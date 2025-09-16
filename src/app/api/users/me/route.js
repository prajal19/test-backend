import { getUserFromToken } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password, ...userData } = user.toObject(); // hide password
  return NextResponse.json(userData);
}
