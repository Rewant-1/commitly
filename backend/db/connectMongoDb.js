// MongoDB database connection utility
import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
		// Connect to MongoDB using connection string from environment
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1); // Exit process if database connection fails
	}
};

export default connectMongoDB;