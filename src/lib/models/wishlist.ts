import mongoose, { Document, model, models, Schema } from "mongoose";
import { IUser } from "./user";

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId | IUser;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist =
  models.Wishlist || model<IWishlist>("Wishlist", wishlistSchema);
export default Wishlist;
