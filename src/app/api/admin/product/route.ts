import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";
import Product, { IProduct } from "@/lib/models/product";
import mongoose from "mongoose";
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
      productCode,
      name,
      description,
      variants,
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
      !productCode ||
      !name ||
      !description ||
      !variants?.length ||
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

    // ✅ Validate variants
    const isVariantValid = variants.every(
      (variant: any) =>
        variant.name &&
        typeof variant.labelPrice === "number" &&
        typeof variant.actualPrice === "number" &&
        typeof variant.stock === "number"
    );

    if (!isVariantValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or incomplete variant data" },
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
      productCode,
      name,
      description,
      variants,
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
      productCode,
      name,
      description,
      variantAdds = [],
      variantUpdates = [],
      variantDeletes = [],
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
    const product = await (Product as mongoose.Model<IProduct>).findById(id);
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
      product.productCode = productCode || product.productCode;
      product.description = description || product.description;
      product.tags = tags || product.tags;
      product.mainCategory = mainCategory || product.mainCategory;
      product.subCategory1 = subCategory1 || product.subCategory1;
      product.subCategory2 = subCategory2 || product.subCategory2;

      // Add new variants
      if (variantAdds && variantAdds.length > 0) {
        for (const newVariant of variantAdds) {
          if (
            newVariant.name &&
            typeof newVariant.labelPrice === "number" &&
            typeof newVariant.actualPrice === "number" &&
            typeof newVariant.stock === "number"
          ) {
            product.variants.push(newVariant);
          }
        }
      }

      // Update existing variants
      if (variantUpdates && variantUpdates.length > 0) {
        product.variants = product.variants.map((existingVariant: any) => {
          const update = variantUpdates.find(
            (v: any) => v.name === existingVariant.name
          );
          return update
            ? {
                ...existingVariant,
                labelPrice: update.labelPrice ?? existingVariant.labelPrice,
                actualPrice: update.actualPrice ?? existingVariant.actualPrice,
                stock: update.stock ?? existingVariant.stock,
              }
            : existingVariant;
        });
      }

      // Delete specific variants by name
      if (variantDeletes && variantDeletes.length > 0) {
        product.variants = product.variants.filter(
          (variant: any) => !variantDeletes.includes(variant.name)
        );
      }

      // SAMPLE INPUT FOR UPDATE PRODUCT WITH UPDATE VARIENT
      //       {
      //   "id": "6616d1c89c7fbb47f3441107",
      //   "name": "Updated Toyota Door",
      //   "variantAdds": [
      //     { "name": "new variant", "labelPrice": 5000, "actualPrice": 4000, "stock": 5 }
      //   ],
      //   "variantUpdates": [
      //     { "name": "toyota door driver side", "actualPrice": 4200, "stock": 6 }
      //   ],
      //   "variantDeletes": ["toyota door passanger side"],
      //   "action": "updateDetails"
      // }

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
