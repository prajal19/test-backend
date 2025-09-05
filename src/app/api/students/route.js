import { NextResponse } from 'next/server';
import Student from '../../models/Student';
import dbConnect from '../../lib/db';

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find().populate('parent', 'name email phone');
    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const student = new Student(data);
    await student.save();
    
    // Populate parents data in response
    await student.populate('parent', 'name email phone');
    
    return NextResponse.json({
      message: 'Student created successfully',
      student
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}