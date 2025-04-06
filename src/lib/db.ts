import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Already connected to DB");
    return;
  }
  if (connectionState === 2) {
    console.log("DB is connecting...");
    return;
  }
  try {
    mongoose.connect(MONGODB_URI!);
    console.log("DB connected successfully");
  } catch (error: any) {
    console.log("Error connecting to DB: ", error);
    throw new Error("Error connecting to DB: ", error);
  }
};

export default connectDB;
