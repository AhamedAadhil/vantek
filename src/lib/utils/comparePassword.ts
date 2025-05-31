import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user";
import mongoose from "mongoose";

export const comparePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  if (!oldPassword || !newPassword) {
    throw new Error("Both old and new passwords are required");
  }

  const user = await (User as mongoose.Model<IUser>)
    .findById(userId)
    .select("password")
    .exec();

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    throw new Error("New password cannot be the same as the old password");
  }

  return true; // Password is valid and can be updated
};
