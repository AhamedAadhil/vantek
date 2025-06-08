import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Order, { IOrder } from "@/lib/models/order";
import { IUser } from "@/lib/models/user";
import { ORDER_STATUS_UPDATE_TEMPLATE } from "@/lib/nodemailer/emailTemplates";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

//GET /api/admin/order
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

// PATCH /api/admin/order
export const PATCH = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }

  try {
    await connectDB();

    const { orderId, status, trackingId, trackingUrl } = await req.json();
    if (!orderId || !mongoose.isValidObjectId(orderId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing order ID" },
        { status: 400 }
      );
    }

    const order = await (Order as mongoose.Model<IOrder>).findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // if (order.paymentStatus === "paid") {
    //   return NextResponse.json(
    //     { success: false, message: "Cannot update a paid order" },
    //     { status: 400 }
    //   );
    // }

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedOrder = await (
      Order as mongoose.Model<IOrder>
    ).findByIdAndUpdate(orderId, { status }, { new: true });

    if (trackingId && trackingUrl) {
      if (!trackingId || !trackingUrl) {
        return NextResponse.json(
          { success: false, message: "Tracking ID and URL are required" },
          { status: 400 }
        );
      }
      updatedOrder.trackingId = trackingId;
      updatedOrder.trackingUrl = trackingUrl;
    }

    await updatedOrder.save();

    if (updatedOrder.status === "delivered")
      await (Order as mongoose.Model<IOrder>).findByIdAndUpdate(
        orderId,
        { paymentStatus: "paid" },
        { new: true }
      );

    const orderToSend = await (Order as mongoose.Model<IOrder>)
      .findById(orderId)
      .populate("user")
      .populate("items.product");

    const user = orderToSend.user as IUser;

    await sendMail({
      to: user.email,
      subject: `Order Status Update: #${orderToSend.orderId}`,
      html: ORDER_STATUS_UPDATE_TEMPLATE(
        user.name,
        orderToSend.orderId,
        orderToSend.status,
        orderToSend.totalAmount,
        orderToSend.deliveryNote
      ),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully.",
        data: orderToSend,
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
