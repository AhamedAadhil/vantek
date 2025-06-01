import mongoose, { Document, model, models, Schema } from "mongoose";

import { IUser } from "./user";
import { IAddress } from "./user";

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  variant: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderId: string;
  paypalOrderId?: string;
  user: mongoose.Types.ObjectId | IUser;
  items: IOrderItem[];
  totalAmount: number;
  isUK: boolean;
  couponCode?: string;
  trackingId?: string;
  trackingUrl?: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "creditCard" | "paypal" | "cod";
  paymentStatus: "paid" | "unpaid";
  shippingMethod: "standard" | "express";
  cardDetails?: {
    brand: string;
    last_digits: string;
    type: string;
  };
  paypalDetails?: {
    email: string;
    accountId: string;
  };
  deliveryNote?: string;
  shippingAddress: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paypalOrderId: {
      type: String,
      unique: true, // Ensure uniqueness for PayPal order ID
      sparse: true, // Allow this field to be optional
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      required: true,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["creditCard", "paypal", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    cardDetails: {
      brand: String,
      last_digits: String,
      type: String,
    },
    paypalDetails: {
      email: String,
      accountId: String,
    },
    shippingAddress: {
      phone: { type: String, required: true },
      apartment: { type: String },
      houseNumber: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    deliveryNote: {
      type: String,
    },
    isUK: {
      type: Boolean,
      default: true,
    },
    couponCode: {
      type: String,
      degault: "",
    },
    trackingId: {
      type: String,
    },
    trackingUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
