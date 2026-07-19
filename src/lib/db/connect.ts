import mongoose from 'mongoose';

let isConnected = false;

async function dbConnect(): Promise<void> {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || '';
  if (!uri) throw new Error('MONGODB_URI (or MONGODB_URL) not configured');
  const db = await mongoose.connect(uri);
  isConnected = db.connections[0].readyState === 1;
}

export default dbConnect;