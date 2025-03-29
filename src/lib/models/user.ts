import mongoose, { model, models, Schema } from "mongoose";

const userSchema = new Schema(
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
        district: { type: String },
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
const User = models.User || model("User", userSchema);
export default User;
