import { NextResponse } from 'next/server';
import Carpool from '@/models/Carpool';
import dbConnect from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const carpool = await Carpool.findById(params.carpoolId)
      .populate('driver', 'name phone carDetails')
      .populate('students', 'name grade school address');
    
    if (!carpool) {
      return NextResponse.json({ error: 'Carpool not found' }, { status: 404 });
    }
    
    return NextResponse.json({ carpool });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const carpool = await Carpool.findByIdAndUpdate(
      params.carpoolId,
      data,
      { new: true, runValidators: true }
    ).populate('driver', 'name phone carDetails')
     .populate('students', 'name grade school address');
    
    if (!carpool) {
      return NextResponse.json({ error: 'Carpool not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Carpool updated successfully', carpool });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const carpool = await Carpool.findByIdAndDelete(params.carpoolId);
    
    if (!carpool) {
      return NextResponse.json({ error: 'Carpool not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Carpool deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}