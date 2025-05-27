import { NextRequest, NextResponse } from "next/server";
import CarouselItem, { ICarouselItem } from "@/lib/models/carousel";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";

// CREATE NEW CAROUSEL ITEM
// POST /api/admin/carousel
export const POST = async (req: NextRequest, res: NextResponse) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();
    const {
      image,
      link,
      title,
      description,
      code,
      percentage,
      startDate,
      endDate,
    } = await req.json();
    if (
      !image ||
      !link ||
      !title ||
      !description ||
      !code ||
      !percentage ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    let imageUrl = "";
    if (image) {
      const response = await cloudinary.uploader.upload(image, {
        folder: "carousel",
        resource_type: "auto",
        transformation: [
          {
            width: 1600,
            height: 600,
            crop: "fill",
            gravity: "auto",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      });

      imageUrl = response.secure_url;
    }

    const carouselItem = new CarouselItem({
      image: imageUrl,
      link,
      title,
      description,
      code,
      isActive: true,
      percentage,
      startDate,
      endDate,
    });
    await carouselItem.save();
    return NextResponse.json(
      { success: true, message: "Carousel item created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

// GET ALL CAROUSEL ITEMS
// GET /api/admin/carousel
export const GET = async (req: NextRequest, res: NextResponse) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();
    const carouselItems = await (CarouselItem as mongoose.Model<ICarouselItem>)
      .find({})
      .sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: carouselItems },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

// DELETE CAROUSEL ITEM
// DELETE /api/admin/carousel/:id
export const DELETE = async (req: NextRequest, res: NextResponse) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing ID" },
        { status: 400 }
      );
    }
    const carouselItem = await (
      CarouselItem as mongoose.Model<ICarouselItem>
    ).findById(id);
    if (!carouselItem) {
      return NextResponse.json(
        { success: false, message: "Carousel item not found" },
        { status: 404 }
      );
    }
    // Get public ID from image URL
    const publicId = carouselItem.image?.split("/").pop()?.split(".")[0];

    // Delete the image from Cloudinary
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`carousel/${publicId}`);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Error deleting image from Cloudinary" },
          { status: 500 }
        );
      }
    }
    // Now delete the document from the database
    await carouselItem.deleteOne();

    return NextResponse.json(
      { success: true, message: "Carousel item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
