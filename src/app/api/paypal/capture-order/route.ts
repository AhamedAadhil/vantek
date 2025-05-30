import Order, { IOrder } from "@/lib/models/order";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Cart from "@/lib/models/cart";
import { ICart } from "@/lib/models/cart";
import Product, { IProduct } from "@/lib/models/product";
import { IUser } from "@/lib/models/user";
import User from "@/lib/models/user";

// /api/paypal/capture-order
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const { paypalOrderId, orderId, userId, processedItems, totalAmount } =
      await req.json();

    // console.log("paypalOrderIdgiven==", paypalOrderId, orderId);

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { message: "Missing paypalOrderId or orderId." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!captureRes.ok) {
      const errorData = await captureRes.json();
      return NextResponse.json(
        {
          message: "Failed to capture PayPal payment.",
          details: errorData,
        },
        { status: captureRes.status }
      );
    }

    const captureData = await captureRes.json();

    if (captureData.status === "COMPLETED") {
      // STEP1- clear cart of user
      const user = await (User as mongoose.Model<IUser>).findById(userId);
      const cartId = user?.cart;
      if (cartId) {
        await (Cart as mongoose.Model<ICart>).findByIdAndDelete(cartId);
      }
      await (User as mongoose.Model<IUser>).findByIdAndUpdate(userId, {
        $set: { cart: null },
      });

      // STEP2- add order to user's orders
      const realOrder = await (Order as mongoose.Model<IOrder>).findOne({
        orderId,
      });

      if (!realOrder) {
        return NextResponse.json(
          { message: "Order with given orderId not found." },
          { status: 404 }
        );
      }

      await (User as mongoose.Model<IUser>).findByIdAndUpdate(userId, {
        $push: { orders: realOrder._id },
      });

      // STEP3- reduce the stock of each products
      for (const item of processedItems) {
        const { product: productId, variant: variantId, quantity } = item;

        await (Product as mongoose.Model<IProduct>).findByIdAndUpdate(
          productId,
          {
            $inc: { "variants.$[elem].stock": -quantity },
          },
          {
            arrayFilters: [{ "elem._id": variantId }],
            new: true,
          }
        );
      }

      // STEP4- add the total to user's totalSpent
      const currentUser = await (User as mongoose.Model<IUser>).findById(
        userId
      );
      currentUser.totalSpent += totalAmount || 0;
      await currentUser.save();

      const updatedOrder = await (
        Order as mongoose.Model<IOrder>
      ).findOneAndUpdate(
        { orderId },
        {
          $set: {
            paymentStatus: "paid",
            paypalOrderId: paypalOrderId,
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        return NextResponse.json(
          { message: "Order not found or update failed." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Payment captured and order updated successfully.",
        success: true,
        userAddress: user?.address || null,
      });
    }

    return NextResponse.json(
      { message: "Payment not completed.", details: captureData },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    return NextResponse.json(
      { message: "Internal server error during payment capture." },
      { status: 500 }
    );
  }
};
