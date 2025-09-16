import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Schedule from '@/app/models/Schedule';
import Group from '@/app/models/Group';
import { authenticate } from '@/app/lib/auth';

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const userId = authenticate(req);
    const schedule = await Schedule.findById(params.scheduleId);
    if (!schedule) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });

    const group = await Group.findById(schedule.group).populate('members', '_id');
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

    const isMember = group.members.some(m => String(m._id) === String(userId));
    if (!isMember) return NextResponse.json({ error: 'Only group members can volunteer' }, { status: 403 });

    const set = new Set((schedule.volunteers || []).map(v => String(v)));
    set.add(String(userId));
    schedule.volunteers = Array.from(set);
    await schedule.save();

    const populated = await Schedule.findById(schedule._id)
      .populate('createdBy', 'name email')
      .populate('group', 'name location')
      .populate('volunteers', 'name email');

    return NextResponse.json(populated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


