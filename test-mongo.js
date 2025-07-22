import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'c:\\Users\\DELL\\OneDrive\\Desktop\\twitter\\.env' });

console.log('Testing MongoDB connection...');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI starts with:', process.env.MONGO_URI?.substring(0, 30) + '...');

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connection successful!');
  console.log('Connected to:', mongoose.connection.host);
  await mongoose.disconnect();
  console.log('✅ Disconnected successfully');
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Error codeName:', error.codeName);
}

process.exit(0);
