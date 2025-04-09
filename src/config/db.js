import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(import.meta.env.VITE_MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
