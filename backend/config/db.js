import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMongoConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI environment variable not configured. Falling back to local JSON database.');
    isMongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('🔌 Connected to MongoDB Atlas successfully.');
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`⚠️ Failed to connect to MongoDB Atlas (${error.message}). Falling back to local JSON database.`);
    isMongoConnected = false;
    return false;
  }
}

export function getIsMongoConnected() {
  return isMongoConnected;
}
export { mongoose };
