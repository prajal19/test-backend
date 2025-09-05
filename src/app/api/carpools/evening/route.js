// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/dbConnect';
// import Carpool from '@/app/models/Carpool';
// import User from '@/app/models/User';
// import Notification from '@/app/models/Notification';
// import { authenticate } from '@/app/lib/auth';

// export async function GET(request) {
//   try {
//     await dbConnect();
//     const userId = authenticate(request);
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Get all active evening carpools for today
//     const carpools = await Carpool.find({
//       type: 'evening',
//       date: { $gte: today, $lt: tomorrow },
//       isActive: true,
//     }).populate('driver', 'name phone carDetails').populate('students.student', 'name grade');
    
//     return NextResponse.json({ carpools }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const userId = authenticate(request);
    
//     const { date, maxCapacity } = await request.json();
    
//     // Check if user already has an active evening carpool for this date
//     const existingCarpool = await Carpool.findOne({
//       driver: userId,
//       type: 'evening',
//       date: new Date(date),
//       isActive: true,
//     });
    
//     if (existingCarpool) {
//       return NextResponse.json(
//         { error: 'You already have an active carpool for this date' },
//         { status: 400 }
//       );
//     }
    
//     // Create new evening carpool
//     const carpool = await Carpool.create({
//       type: 'evening',
//       date,
//       driver: userId,
//       maxCapacity,
//     });
    
//     // Update user's availability
//     await User.findByIdAndUpdate(userId, {
//       'isAvailable.evening': true,
//     });
    
//     // Send notification to all parents
//     const parents = await User.find({ _id: { $ne: userId } });
//     const notificationPromises = parents.map(parent => 
//       Notification.create({
//         recipient: parent._id,
//         message: `A new evening carpool has been created for ${new Date(date).toLocaleDateString()}`,
//         type: 'carpool-created',
//         relatedCarpool: carpool._id,
//       })
//     );
    
//     await Promise.all(notificationPromises);
    
//     return NextResponse.json({ carpool }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from 'next/server';
import Carpool from '@/models/Carpool';
import Parent from '@/models/Parent';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const carpools = await Carpool.find({
      type: 'evening',
      date: { $gte: today, $lt: tomorrow }
    }).populate('driver', 'name phone carDetails')
      .populate('students', 'name grade school address');
    
    return NextResponse.json({ carpools });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { driverId, studentIds, date, route } = await request.json();
    
    // Check if driver exists and is available for evening
    const driver = await Parent.findById(driverId);
    if (!driver || !driver.isAvailable.evening) {
      return NextResponse.json({ error: 'Driver not available for evening carpool' }, { status: 400 });
    }
    
    // Check if driver has already created an evening carpool for this date
    const existingCarpool = await Carpool.findOne({
      driver: driverId,
      type: 'evening',
      date: new Date(date)
    });
    
    if (existingCarpool) {
      return NextResponse.json({ error: 'Driver already has an evening carpool for this date' }, { status: 400 });
    }
    
    const carpool = new Carpool({
      type: 'evening',
      date: new Date(date),
      driver: driverId,
      students: studentIds,
      route,
      status: 'scheduled'
    });
    
    await carpool.save();
    
    // Populate the response with driver and student details
    await carpool.populate('driver', 'name phone carDetails');
    await carpool.populate('students', 'name grade school address');
    
    return NextResponse.json({
      message: 'Evening carpool created successfully',
      carpool
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}