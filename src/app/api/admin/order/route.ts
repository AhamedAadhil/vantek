import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Order, { IOrder } from "@/lib/models/order";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

//  /api/admin/order
export const GET = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }

  try {
    await connectDB();

    // 🧹 Clean up unpaid orders older than 30 minutes
    const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    const deleted = await (Order as mongoose.Model<IOrder>).deleteMany({
      paymentStatus: "unpaid",
      createdAt: { $lt: threshold },
    });

    console.log(
      `[Admin Order API] Deleted ${deleted.deletedCount} stale unpaid orders.`
    );

    const orders = await (Order as mongoose.Model<IOrder>)
      .find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("items.product");

    return NextResponse.json(
      {
        success: true,
        message: "Orders fetched successfully.",
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
