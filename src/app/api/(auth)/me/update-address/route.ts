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
    const { address } = await req.json();
    const userId = req.headers.get("userId");

    if (!address || typeof address !== "object") {
      return NextResponse.json(
        {
          message: "Invalid address format",
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

    user.address[0] = {
      ...user.address[0],
      ...address,
    };

    await user.save();

    return NextResponse.json(
      {
        message: "Address updated successfully",
        success: true,
        address: user.address[0],
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
