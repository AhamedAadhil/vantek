import Order, { IOrder } from "@/lib/models/order"; // adjust path as needed
import mongoose from "mongoose";

async function generateUniqueOrderId(): Promise<string> {
  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    const orderId = `VT-${randomNumber}`;
    const existing = await (Order as mongoose.Model<IOrder>).findOne({
      orderId,
    });
    if (!existing) return orderId;
  }
  throw new Error(
    "Failed to generate a unique orderId after multiple attempts."
  );
}

export default generateUniqueOrderId;
