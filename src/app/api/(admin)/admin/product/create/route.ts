import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Product from "@/lib/models/product";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();
    const {
      name,
      description,
      labelPrice,
      actualPrice,
      stock,
      tags,
      mainCategory,
      subCategory1,
      subCategory2,
      images,
      topSellingProduct,
      featuredProduct,
    } = await req.json();

    // ✅ Validate required fields
    if (
      !name ||
      !description ||
      !actualPrice ||
      !labelPrice ||
      !mainCategory ||
      !subCategory1 ||
      !subCategory2 ||
      !images?.length
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create new product
    const newProduct = new Product({
      name,
      description,
      labelPrice,
      actualPrice,
      stock,
      tags,
      mainCategory,
      subCategory1,
      subCategory2,
      images,
      topSellingProduct,
      featuredProduct,
    });

    await newProduct.save();
    return NextResponse.json(
      {
        success: true,
        product: newProduct,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
