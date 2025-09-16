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

    const notifications = await Notification.find({ recipient: userId })
      .populate('relatedRide')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({ recipient: userId });

    return NextResponse.json({ notifications, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const userId = authenticate(request);
    const { notificationId } = await request.json();

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const userId = authenticate(request);
    const { recipient, type, message, relatedRide } = await request.json();

    const notif = await Notification.create({ recipient: recipient || userId, type, message, relatedRide });
    return NextResponse.json(notif, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}