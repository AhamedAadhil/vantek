import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import Order, { IOrder } from "@/lib/models/order";
import Product, { IProduct } from "@/lib/models/product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// CREATE REVIEW
// POST /api/products/reviews
export const POST = async (req: NextRequest) => {
  const { productId, review, orderId, variantId } = await req.json();
  console.log(productId, review, orderId, variantId);
  try {
    const isAuthMiddlewareResponse = await authMiddleware(req);
    if (isAuthMiddlewareResponse) {
      return isAuthMiddlewareResponse;
    }

    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    if (!productId || !review || !orderId) {
      return NextResponse.json(
        {
          message: "Product ID, review, and order ID are required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Step 1: Validate review structure
    const { rate, comment } = review;
    if (typeof rate !== "number" || rate < 1 || rate > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5", success: false },
        { status: 400 }
      );
    }

    if (comment && typeof comment !== "string") {
      return NextResponse.json(
        { message: "Comment must be word or sentence", success: false },
        { status: 400 }
      );
    }

    await connectDB();

    // Step 2: Check if product exists
    const product = await (Product as mongoose.Model<IProduct>).findById(
      productId
    );
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Step 3: Check if the user purchased this product variant in the given order
    const order = await (Order as mongoose.Model<IOrder>).findOne({
      orderId: orderId,
      user: userId,
      "items.product": productId,
      "items.variant": variantId,
    });

    if (!order) {
      return NextResponse.json(
        {
          message: "You can only review products you have purchased",
          success: false,
        },
        { status: 403 }
      );
    }

    if (order.status !== "delivered") {
      return NextResponse.json(
        {
          message: "You can only review products from delivered orders",
          success: false,
        },
        { status: 403 }
      );
    }

    // Step 4: Prevent duplicate review for the same order + variant
    const alreadyReviewed = product.reviews.find(
      (r) =>
        r.userId.toString() === userId &&
        r.orderId.toString() === orderId &&
        r.variantId.toString() === variantId
    );

    if (alreadyReviewed) {
      return NextResponse.json(
        {
          message:
            "You have already reviewed this product variant in this order",
          success: false,
        },
        { status: 400 }
      );
    }

    // Step 5: Add the review
    product.reviews.push({
      userId: new mongoose.Types.ObjectId(userId),
      rate,
      comment,
      orderId: orderId,
      variantId: new mongoose.Types.ObjectId(variantId),
    });

    // Step 6: Recalculate overall rating
    const totalRatings = product.reviews.reduce(
      (acc, curr) => acc + curr.rate,
      0
    );
    product.overAllRating = totalRatings / product.reviews.length;

    // Step 7: Save
    await product.save();

    return NextResponse.json(
      { message: "Review added successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while posting review",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
};
