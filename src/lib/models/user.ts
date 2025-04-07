import mongoose, { model, models, Schema, Document } from "mongoose";

// Define Address Type
export interface IAddress {
  phone?: string;
  houseNumber?: string;
  street?: string;
  city?: string;
  district?: string;
  zipCode?: string;
  country?: string;
}

// Define IUser Interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  isActive: boolean;
  address: IAddress[];
  cart: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  resetToken?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: [
      {
        phone: { type: String, sparse: true },
        houseNumber: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    resetToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const User = models.User || model<IUser>("User", userSchema);
export default User;
