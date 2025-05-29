import Order, { IOrder } from "@/lib/models/order";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// /api/paypal/capture-order
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const { paypalOrderId, orderId } = await req.json();

    console.log("paypalOrderIdgiven==", paypalOrderId, orderId);

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { message: "Missing paypalOrderId or orderId." },
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
