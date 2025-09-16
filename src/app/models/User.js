// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   carDetails: {
//     make: String,
//     model: String,
//     color: String,
//     licensePlate: String,
//   },
//   availability: [{ // New structure (add this)
//     date: { type: Date, required: true },
//     morning: { type: Boolean, default: false },
//     evening: { type: Boolean, default: false }
//   }],
//   role: {
//     type: String,
//     enum: ['parent', 'admin'],
//     default: 'parent',
//   },
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model('User', userSchema);




// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// //   location: { type: String }, // optional: store location
// // }, 
//  location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         default: [0, 0],
//       },
//     },
//     car: {
//     model: { type: String }, 
//     capacity: { type: Number, default: 4 }, // total seats including driver
//     // isAvailable: { type: Boolean, default: true }, // parent available today
//   }
//   },{ timestamps: true });

//   userSchema.index({ location: "2dsphere" });


// export default mongoose.models.User || mongoose.model('User', userSchema);



import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number } // optional
});

const carSchema = new mongoose.Schema({
  model: { type: String, required: false },
  capacity: { type: Number, required: false } // total seats including driver
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    // Each user is always a parent
    children: [childSchema],

    // Car details
    car: carSchema,

    // GeoJSON for location
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point"
    //   },
    //   coordinates: {
    //     type: [Number], // [longitude, latitude]
    //     default: [0, 0],
    //     // required: true
    //   }
    // }

    // location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    
  },
  { timestamps: true }
);



export default mongoose.models.User || mongoose.model("User", userSchema);
