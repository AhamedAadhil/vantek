import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import User, { IUser } from "@/lib/models/user";
import { comparePassword } from "@/lib/utils/comparePassword";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  // 1. Auth Check
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }

  try {
    // 2. Connect to DB
    await connectDB();

    // 3. Get userId from header
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID missing from request headers",
          success: false,
        },
        { status: 400 }
      );
    }

    // 4. Parse and validate input
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          message:
            "Invalid input. Ensure passwords are provided and new password has at least 6 characters.",
          error:
            "Invalid input. Ensure passwords are provided and new password has at least 6 characters.",
          success: false,
        },
        { status: 400 }
      );
    }

    // 5. Find user
    const user = await (User as mongoose.Model<IUser>)
      .findById(userId)
      .select("+password") // Ensure password is included if it's excluded by default
      .exec();

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // 6. Compare passwords
    const isValid = await comparePassword(userId, oldPassword, newPassword);
    if (!isValid) {
      return NextResponse.json(
        {
          message: "Old password is incorrect or same as new password",
          success: false,
        },
        { status: 400 }
      );
    }

    // 7. Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 8. Save updated user
    await user.save();

    const response = NextResponse.json(
      {
        message: "Password updated successfully. Please log in again.",
        success: true,
      },
      { status: 200 }
    );

    // Clear the token cookie immediately
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong during password update",
        error: (error as Error).message,
        success: false,
      },
      { status: 500 }
    );
  }
};
