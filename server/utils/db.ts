import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbUrl: string = process.env.DB_URL || "";

const mongodbconnection = async () => {
  try {
    const connection = await mongoose.connect(dbUrl);
    console.log(`Database connected successfully to host: ${connection.connection.host}`);
  } catch (err:any) {
    console.error("Database connection error:", err.message);
    
    setTimeout(mongodbconnection, 5000);
  }
};

export default mongodbconnection;
