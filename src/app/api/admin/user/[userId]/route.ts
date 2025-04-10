import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// TOGGLE USER ACTIVE STATUS
// PATCH /api/admin/user/:userId
export const PATCH = async (
  req: NextRequest,
  context: { params: { userId: string } }
) => {
  try {
    if (!context.params || !context.params.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const { userId } = context.params;

    await connectDB();
    const user = await (User as mongoose.Model<IUser>)
      .findById(userId)
      .select("isActive")
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Toggle the isActive status
    user.isActive = !user.isActive;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `User ${
          user.isActive ? "activated" : "deactivated"
        } successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
