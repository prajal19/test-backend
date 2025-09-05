import { NextResponse } from 'next/server';
import Tracking from '@/models/Tracking';
import dbConnect from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    const trackingData = await Tracking.find({ carpool: params.carpoolId })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    return NextResponse.json({ tracking: trackingData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}