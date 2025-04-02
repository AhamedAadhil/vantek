import mongoose, { model, models, Schema } from "mongoose";

const mainCategories = ["VW-T5", "VW-T6.1", "VW-T7", "Universal Camper Parts"];

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
      required: true,
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
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
