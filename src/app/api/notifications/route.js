import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Notification from '@/app/models/Notification';
import { authenticate } from '@/app/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const userId = authenticate(request);
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    
    // Get notifications for the current user
    const notifications = await Notification.find({ recipient: userId })
      .populate('relatedCarpool')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    // Get total count for pagination
    const total = await Notification.countDocuments({ recipient: userId });
    
    return NextResponse.json({ notifications, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const userId = authenticate(request);
    
    const { notificationId } = await request.json();
    
    // Mark notification as read
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}