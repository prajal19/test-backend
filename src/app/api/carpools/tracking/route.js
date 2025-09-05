import { NextResponse } from 'next/server';
import Tracking from '@/models/Tracking';
import Carpool from '@/models/Carpool';
import dbConnect from '@/lib/db';

export async function POST(request) {
  try {
    await dbConnect();
    const { carpoolId, location, status } = await request.json();
    
    // Verify carpool exists
    const carpool = await Carpool.findById(carpoolId);
    if (!carpool) {
      return NextResponse.json({ error: 'Carpool not found' }, { status: 404 });
    }
    
    // Create tracking record
    const tracking = new Tracking({
      carpool: carpoolId,
      location,
      status: status || 'enroute'
    });
    
    await tracking.save();
    
    // Update carpool status if provided
    if (status && carpool.status !== status) {
      carpool.status = status;
      await carpool.save();
    }
    
    return NextResponse.json({
      message: 'Location updated successfully',
      tracking
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}