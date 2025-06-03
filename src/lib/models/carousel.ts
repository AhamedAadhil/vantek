import mongoose, { Document, models, model, Schema } from "mongoose";

export interface ICarouselItem extends Document {
  image: string;
  link: string;
  title: string;
  description?: string;
  code?: string;
  usedBy?: mongoose.Types.ObjectId[];
  isActive?: boolean;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const carouselItemSchema = new Schema<ICarouselItem>(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
      default: "",
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    percentage: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CarouselItem =
  models.CarouselItem ||
  model<ICarouselItem>("CarouselItem", carouselItemSchema);
export default CarouselItem;
