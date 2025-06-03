// /api/coupon/validate.ts
import connectDB from "@/lib/db";
import CarouselItem, { ICarouselItem } from "@/lib/models/carousel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { code, userId } = await req.json();

  if (!code || !userId) {
    return NextResponse.json(
      { message: "Missing data", success: false },
      { status: 400 }
    );
  }

  const coupon = await (CarouselItem as mongoose.Model<ICarouselItem>).findOne({
    code,
    isActive: true,
  });

  if (!coupon) {
    return NextResponse.json(
      { message: "Invalid or expired coupon", success: false },
      { status: 400 }
    );
  }

  const now = new Date();

  if (coupon.startDate && now < coupon.startDate) {
    return NextResponse.json(
      { message: "Coupon not active yet", success: false },
      { status: 400 }
    );
  }

  if (coupon.endDate && now > coupon.endDate) {
    return NextResponse.json(
      { message: "Coupon expired", success: false },
      { status: 400 }
    );
  }

  if (coupon.usedBy?.includes(userId)) {
    return NextResponse.json(
      { message: "You have already used this coupon", success: false },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Coupon valid",
    success: true,
    percentage: coupon.percentage,
    couponCode: coupon.code,
  });
};
