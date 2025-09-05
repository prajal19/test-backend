import { NextResponse } from 'next/server';
import Parent from '@/models/Parent';
import dbConnect from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const parent = await Parent.findById(params.id).select('-password');
    
    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    return NextResponse.json({ parent });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Don't allow password updates through this route
    if (data.password) {
      delete data.password;
    }

    const parent = await Parent.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).select('-password');

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Parent updated successfully', parent });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}