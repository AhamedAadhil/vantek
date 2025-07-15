// GET ALL ACTIVE CAROUSEL ITEMS
// GET /api/carousel
import connectDB from "@/lib/db";
import CarouselItem, { ICarouselItem } from "@/lib/models/carousel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectDB();
    const now = new Date();

    // Auto-deactivate expired promos (optional, if you want DB cleanup)
    await CarouselItem.updateMany(
      { isActive: true, endDate: { $lt: now } },
      { $set: { isActive: false } }
    );

    // Return only active banners within valid date range
    const activeCarouselItems = await (
      CarouselItem as mongoose.Model<ICarouselItem>
    )
      .find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: activeCarouselItems },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
