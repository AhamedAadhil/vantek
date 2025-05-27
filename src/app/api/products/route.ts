import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/lib/models/product";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    // ✅ Extract query params from the request URL
    const { searchParams } = new URL(req.url);
    const page: number = parseInt(searchParams.get("page")) || 1;
    const limit: number = parseInt(searchParams.get("limit")) || 10;
    const search: string = searchParams.get("search") || "";
    const mainCategory: string = searchParams.get("mainCategory") || "";
    const subCategory1: string = searchParams.get("subCategory1") || "";
    // const subCategory2: string = searchParams.get("subCategory2") || "";
    const subCategory2: string[] =
      searchParams.get("subCategory2")?.split(",") || [];
    const featured: boolean = searchParams.get("featuredProduct") === "true";
    const topSelling: boolean =
      searchParams.get("topSellingProduct") === "true";
    const minPrice: number = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice: number =
      parseFloat(searchParams.get("maxPrice")) || Number.MAX_VALUE;
    const minRating: number = parseFloat(searchParams.get("minRating")) || 0;
    const stockAvailable: boolean =
      searchParams.get("stockAvailable") === "true"; // If true, filter only available stock

    // ✅ Build Query Object
    let query = {} as Record<string, any>;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (subCategory2.length > 0) {
      query.subCategory2 = { $in: subCategory2 };
    }
    if (mainCategory) query.mainCategory = mainCategory;
    if (subCategory1) query.subCategory1 = subCategory1;
    // if (subCategory2) query.subCategory2 = subCategory2;
    if (featured) query.featuredProduct = true;
    if (topSelling) query.topSellingProduct = true;
    if (minPrice || maxPrice)
      query["variants.actualPrice"] = { $gte: minPrice, $lte: maxPrice };
    if (minRating) query["reviews.rate"] = { $gte: minRating };
    if (stockAvailable) query["variants.stock"] = { $gt: 0 }; // Only products with stock > 0

    // ✅ Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    // ✅ Fetch filtered products with pagination
    const products = await (Product as mongoose.Model<IProduct>)
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // Latest products first

    return NextResponse.json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
