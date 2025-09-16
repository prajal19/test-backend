import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Schedule from '@/app/models/Schedule';
import Group from '@/app/models/Group';
import { authenticate } from '@/app/lib/auth';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const groupId = params.id;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const type = searchParams.get('type');

    const query = { group: groupId };
    if (dateParam) {
      const start = new Date(dateParam);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateParam);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    if (type) query.type = type;

    const schedules = await Schedule.find(query)
      .sort({ date: 1, createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('group', 'name location')
      .populate('volunteers', 'name email');

    return NextResponse.json(schedules, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const groupId = params.id;
    const userId = authenticate(req);

    const group = await Group.findById(groupId).populate('members', '_id');
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

    const isMember = group.members.some(m => String(m._id) === String(userId));
    if (!isMember) return NextResponse.json({ error: 'Only group members can create schedules' }, { status: 403 });

    const body = await req.json();
    const { date, type, notes, childName } = body || {};

    if (!date) return NextResponse.json({ error: 'date is required (ISO string)' }, { status: 400 });
    if (!['morning', 'evening'].includes(type)) {
      return NextResponse.json({ error: "type must be 'morning' or 'evening'" }, { status: 400 });
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.valueOf())) {
      return NextResponse.json({ error: 'date must be a valid ISO string' }, { status: 400 });
    }

    const created = await Schedule.create({
      group: groupId,
      createdBy: userId,
      date: dateObj,
      type,
      notes,
      childName,
      volunteers: [],
    });

    const populated = await Schedule.findById(created._id)
      .populate('createdBy', 'name email')
      .populate('group', 'name location')
      .populate('volunteers', 'name email');

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


