import mongoose, { model, models, Schema, Document } from "mongoose";

const mainCategories = ["VW-T5", "VW-T6.1", "VW-T7", "Universal Camper Parts"];

// Define Review Interface
export interface IReview {
  userId: mongoose.Types.ObjectId;
  rate: number;
  comment?: string;
  order: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Product Interface
export interface IProduct extends Document {
  name: string;
  description: string;
  mainCategory: "VW-T5" | "VW-T6.1" | "VW-T7" | "Universal Camper Parts"; // Enum values
  subCategory1: string;
  subCategory2: string;
  tags: string[];
  labelPrice: number;
  actualPrice: number;
  images: string[];
  topSellingProduct: boolean;
  featuredProduct: boolean;
  isVisible: boolean;
  stock: number;
  overAllRating: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

// Separate schema for Reviews
const reviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainCategory: {
      type: String,
      required: true,
      enum: mainCategories,
    },
    subCategory1: {
      type: String,
      required: true,
    },
    subCategory2: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10, // Limit tags
        message: "Maximum 10 tags allowed",
      },
    },
    labelPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    actualPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
    },
    topSellingProduct: {
      type: Boolean,
      required: true,
      default: false,
    },
    featuredProduct: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVisible: {
      type: Boolean,
      required: true,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    overAllRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;
