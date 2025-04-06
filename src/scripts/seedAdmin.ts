import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@vantek.com";
    const adminPassword = "123456";

    const existingAdmin: IUser | null = await (
      User as mongoose.Model<IUser>
    ).findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      mongoose.connection.close();
      return;
    }
    const hashPassword: string = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      email: adminEmail,
      password: hashPassword,
      role: "admin",
    });
    await admin.save();
    console.log("Admin created successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding admin: ", error);
    mongoose.connection.close();
  }
};

seedAdmin();
