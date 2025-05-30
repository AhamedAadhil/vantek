import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// /api/me/update-address
export const PATCH = async (req: NextRequest, res: NextResponse) => {
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }
  try {
    await connectDB();
    const { name } = await req.json();
    const userId = req.headers.get("userId");

    if (!name) {
      return NextResponse.json(
        {
          message: "Name not provided",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const user = await (User as mongoose.Model<IUser>).findById(userId).exec();
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    user.name = name;

    await user.save();

    return NextResponse.json(
      {
        message: "Username updated successfully",
        success: true,
        name: user.name,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
