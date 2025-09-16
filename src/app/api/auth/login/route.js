// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/db';
// import User from '@/app/models/User';
// import { comparePassword, generateToken } from '@/app/lib/auth';

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const { email, password } = await request.json();

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Check password
//     const isPasswordValid = await comparePassword(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Generate token
//     const token = generateToken(user._id);

//     // Return user without password
//     const { password: _, ...userWithoutPassword } = user.toObject();

//     return NextResponse.json(
//       { user: userWithoutPassword, token },
//       { status: 200 }
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
import { comparePassword, signToken } from "@/app/lib/auth";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

  const token = signToken({ userId: user._id, email: user.email });
  return new Response(JSON.stringify({ token }), { status: 200 });
}
