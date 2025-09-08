import mongoose from 'mongoose';

if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
  throw new Error(
    "MONGODB_URI or DATABASE_URL must be set. Please provide your MongoDB connection string.",
  );
}

// Use MONGODB_URI if provided, otherwise fall back to DATABASE_URL
const connectionString = process.env.MONGODB_URI || process.env.DATABASE_URL;

export async function connectToMongoDB() {
  try {
    await mongoose.connect(connectionString!);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export { mongoose };