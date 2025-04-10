import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart, { ICart } from "@/lib/models/cart";
import mongoose from "mongoose";

// GET CURRENT USERS CART
// GET /api/cart
export async function GET(
  req: NextRequest,
  context: { params?: { userId?: string } }
) {
  const { userId } = context.params;

  try {
    await connectDB();
    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID not provided",
          success: false,
        },
        { status: 400 }
      );
    }

    const cart = await (Cart as mongoose.Model<ICart>)
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return NextResponse.json(
        {
          message: "Cart not found",
          success: false,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: cart,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
}
