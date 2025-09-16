// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/db';
// import User from '@/app/models/User';
// import { hashPassword, generateToken } from '@/app/lib/auth';

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const { name, email, password, phone, address, carDetails } = await request.json();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash password and create user
//     const hashedPassword = await hashPassword(password);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       address,
//       carDetails,
//     });

//     // Generate token
//     const token = generateToken(user._id);

//     // Return user without password
//     const { password: _, ...userWithoutPassword } = user.toObject();

//     return NextResponse.json(
//       { user: userWithoutPassword, token },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }





import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { hashPassword } from "@/app/lib/auth";

export async function POST(req) {
  await dbConnect();
  const { name, email, password, phone } = await req.json();

  if (!name || !email || !password || !phone) {
    return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, phone });

  return new Response(JSON.stringify({ message: "User created", userId: user._id }), { status: 201 });
}
