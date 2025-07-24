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

    // Auto-deactivate expired promos
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

    // Add lastUpdated as the latest `updatedAt` or `createdAt` timestamp
    const lastUpdated =
      activeCarouselItems.length > 0
        ? new Date(
            Math.max(
              ...activeCarouselItems.map((item) =>
                new Date(item.updatedAt || item.createdAt).getTime()
              )
            )
          ).toISOString()
        : new Date().toISOString();

    return NextResponse.json(
      { success: true, lastUpdated, data: activeCarouselItems },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
