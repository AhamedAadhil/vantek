import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import Order, { IOrder } from "@/lib/models/order";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// / /api/me/orders
export const GET = async (req: NextRequest, res: NextResponse) => {
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }

  try {
    await connectDB();

    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const orders = await (Order as mongoose.Model<IOrder>)
      .find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });
    return NextResponse.json({ orders, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
