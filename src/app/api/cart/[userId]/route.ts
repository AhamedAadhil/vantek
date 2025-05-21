import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart, { ICart } from "@/lib/models/cart";
import mongoose from "mongoose";
import Product, { IProduct } from "@/lib/models/product";

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
      .populate("items.product", "_id name images");

    if (!cart) {
      return NextResponse.json(
        {
          message: "User's cart not found",
          success: true,
        },
        { status: 404 }
      );
    }

    // Enhance items with actualPrice from variant
    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product: any = item.product;
        const variantId = item.variantId;

        if (!product || !variantId) return item;

        // Fetch full product (to get variants)
        const fullProduct = await (Product as mongoose.Model<IProduct>).findById(product._id).select("variants");

        const variant = fullProduct?.variants.find(
          (v: any) => v._id.toString() === variantId.toString()
        );

        return {
          ...item.toObject(),
          variantActualPrice: variant?.actualPrice,
        };
      })
    );

    return NextResponse.json(
      {
        data: {
          ...cart.toObject(),
          items: updatedItems,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}
