import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global variable to cache the connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to MongoDB
async function dbConnect() {
  // If already connected, return the connection
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📡 Connection string: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`); // Hide password
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Successfully connected to MongoDB');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('💡 Check your connection string and make sure MongoDB is running');
        // Don't cache failed connections
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Immediately attempt connection when this module is imported
// This will make the connection happen when the server starts
console.log('🚀 Starting MongoDB connection...');
dbConnect().then(() => {
  console.log('🎯 MongoDB connection initialized');
}).catch((error) => {
  console.error('💥 Failed to initialize MongoDB connection:', error.message);
});

export default dbConnect;