// GET ALL CAROUSEL ITEMS
// GET /api/carousel
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import CarouselItem, { ICarouselItem } from "@/lib/models/carousel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectDB();
    const carouselItems = await (CarouselItem as mongoose.Model<ICarouselItem>)
      .find({})
      .sort({ createdAt: -1 });
    const now = new Date();

    // For any active promo past its endDate, mark inactive
    const updates = carouselItems.map(async (item) => {
      if (item.isActive && item.endDate < now) {
        item.isActive = false;
        await item.save();
      }
    });
    await Promise.all(updates);

    // Refetch after updates (optional, but safer to send fresh data)
    const updatedCarouselItems = await (
      CarouselItem as mongoose.Model<ICarouselItem>
    )
      .find({})
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(
      { success: true, data: updatedCarouselItems },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
