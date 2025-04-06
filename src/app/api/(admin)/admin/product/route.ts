import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Product from "@/lib/models/product";
import { NextRequest, NextResponse } from "next/server";

// CREATE NEW PRODUCT
// POST /api/admin/product
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

    let imageUrls = [];
    // ✅ Upload images to Cloudinary and get URLs
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (image: string) =>
        cloudinary.uploader.upload(image, {
          folder: "products",
          resource_type: "auto",
          transformation: [
            {
              width: 800,
              height: 800,
              crop: "fill",
              gravity: "auto",
              quality: "auto",
            },
          ],
        })
      );
      const cloudinaryResponses = await Promise.all(uploadPromises);
      imageUrls = cloudinaryResponses.map((response) => response.secure_url);
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
      images: imageUrls,
      topSellingProduct,
      featuredProduct,
      isVisible: true,
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

// UPDATE PRODUCT
// PATCH /api/admin/product
export const PATCH = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();
    const {
      id,
      name,
      description,
      labelPrice,
      actualPrice,
      stock,
      tags,
      mainCategory,
      subCategory1,
      subCategory2,
      deletedImages,
      newImages,
      topSellingProduct,
      featuredProduct,
      action,
    } = await req.json();
    console.log("topSellingProduct", topSellingProduct);
    console.log("featuredProduct", featuredProduct);
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    // ✅ toggle Visibility of the product
    if (action === "toggleVisibility") {
      product.isVisible = !product.isVisible;
      await product.save();
      return NextResponse.json(
        {
          success: true,
          product,
          message: `Product visibility updated to ${product.isVisible}`,
        },
        { status: 200 }
      );
    } else if (action === "toggleTopSelling") {
      product.topSellingProduct = !product.topSellingProduct;
      await product.save();
      return NextResponse.json(
        {
          success: true,
          product,
          message: `Product top selling status updated to ${product.topSellingProduct}`,
        },
        { status: 200 }
      );
    } else if (action === "toggleFeatured") {
      product.featuredProduct = !product.featuredProduct;
      await product.save();
      return NextResponse.json(
        {
          success: true,
          product,
          message: `Product featured status updated to ${product.featuredProduct}`,
        },
        { status: 200 }
      );
    }

    // ✅ Update product details
    else if (action === "updateDetails") {
      // delete image from cloudinary and product
      if (deletedImages && deletedImages.length > 0) {
        for (const image of deletedImages) {
          const publicId = image.split("/").pop().split(".")[0];
          try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log(`Image Deleted from Cloudinary: ${image}`);
            product.images = product.images.filter(
              (img: string) => img !== image
            );
            console.log(`Image Deleted from Product: ${image}`);
          } catch (error) {
            return NextResponse.json(
              { success: false, message: "Error deleting image" },
              { status: 500 }
            );
          }
        }
      }

      // upload new images if any provided
      let newImageURLs = [];
      if (newImages && newImages.length > 0) {
        const uploadPromises = newImages.map(async (image: string) =>
          cloudinary.uploader.upload(image, {
            folder: "products",
            resource_type: "auto",
            transformation: [
              {
                width: 800,
                height: 800,
                crop: "fill",
                gravity: "auto",
                quality: "auto",
              },
            ],
          })
        );
        const cloudinaryResponses = await Promise.all(uploadPromises);
        newImageURLs = cloudinaryResponses.map(
          (response) => response.secure_url
        );
        product.images.push(...newImageURLs);
        console.log("New images uploaded:");
      }

      // update the details of the product
      product.name = name || product.name;
      product.description = description || product.description;
      product.labelPrice = labelPrice || product.labelPrice;
      product.actualPrice = actualPrice || product.actualPrice;
      product.stock = stock || product.stock;
      product.tags = tags || product.tags;
      product.mainCategory = mainCategory || product.mainCategory;
      product.subCategory1 = subCategory1 || product.subCategory1;
      product.subCategory2 = subCategory2 || product.subCategory2;
      await product.save();

      return NextResponse.json(
        {
          success: true,
          product,
          message: "Product updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
