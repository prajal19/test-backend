import { NextResponse } from 'next/server';
import Parent from '@/models/Parent';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    const parents = await Parent.find().select('-password');
    return NextResponse.json({ parents });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}