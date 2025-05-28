import generateUniqueOrderId from "@/helper/generateOrderId";
import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import Cart, { ICart } from "@/lib/models/cart";
import Order, { IOrder } from "@/lib/models/order";
import Product, { IProduct } from "@/lib/models/product";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  // ✅ Use the authMiddleware to check if the request is authenticated
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }
  try {
    await connectDB();
    // get current user id and role and verify with response data
    const currentUserId = req.headers.get("userId");
    const role = req.headers.get("role");
    if (!currentUserId) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          success: false,
        },
        { status: 401 }
      );
    }
    if (role !== "user") {
      return NextResponse.json(
        {
          message: "Admin can't checkout",
          success: false,
        },
        { status: 401 }
      );
    }

    // get data from frontend
    const {
      userId,
      items,
      isUk,
      couponCode,
      shippingMethod,
      deliveryNote,
      shippingAddress,
    } = await req.json();

    // makesure user is authenticated
    if (currentUserId !== userId) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          success: false,
        },
        { status: 401 }
      );
    }

    // Normalize items to always be an array
    const itemsArray = Array.isArray(items) ? items : [items];

    // console.log("Items Array:", itemsArray);
    // console.log("items==:", items);

    // STEP1 - calculate the total Amount
    let totalAmount = 0;
    const processedItems = [];

    // If itemsArray looks like [{ items: [...] }], then:
    const rawItems = itemsArray[0]?.items || [];
    // console.log("rawItems:", rawItems);

    for (const item of rawItems) {
      const { product: productId, variant: variantId, quantity } = item;

      // Find product by ID
      const product = await (Product as mongoose.Model<IProduct>).findById(
        productId
      );
      if (!product) {
        return NextResponse.json(
          { message: `Product with id ${productId} not found`, success: false },
          { status: 400 }
        );
      }

      // Find variant inside product variants
      const variant = product.variants.find(
        (v) => v._id.toString() === variantId
      );
      if (!variant) {
        return NextResponse.json(
          {
            message: `Variant with id ${variantId} not found in product ${productId}`,
            success: false,
          },
          { status: 400 }
        );
      }

      // Calculate price * quantity
      const price = variant.actualPrice;
      const itemTotal = price * quantity;

      totalAmount += itemTotal;

      // Push processed item with price info
      processedItems.push({
        product: product._id,
        variant: variant._id,
        quantity,
        price,
      });
    }
    // STEP2 - calculate the shipping fee
    let shippingFee = 0;

    if (isUk) {
      if (totalAmount < 150) {
        if (shippingMethod === "express") {
          shippingFee = 8.5;
        } else if (shippingMethod === "standard") {
          shippingFee = 4.5;
        }
      }
    } else {
      // Do nothing; the client will contact the user manually.
      shippingFee = 0;
    }

    // STEP3- calculate the total amount with shipping fee
    totalAmount += shippingFee;

    // STEP4- append user address details with user
    await (User as mongoose.Model<IUser>).findByIdAndUpdate(
      userId,
      {
        $set: {
          address: [shippingAddress], // Overwrite entire address array with new one
        },
      },
      { new: true }
    );

    // STEP5- Create the order
    // TODO: modify to make it payed after integrate payhere
    const order = new (Order as mongoose.Model<IOrder>)({
      orderId: await generateUniqueOrderId(),
      user: userId,
      items: processedItems,
      totalAmount,
      isUk,
      couponCode,
      shippingMethod,
      deliveryNote,
      shippingAddress,
      status: "pending",
      paymentMethod: "paypal",
      paymentStatus: "unpaid",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await order.save();

    // STEP6- clear cart of user
    const user = await (User as mongoose.Model<IUser>).findById(userId);
    const cartId = user?.cart;
    if (cartId) {
      await (Cart as mongoose.Model<ICart>).findByIdAndDelete(cartId);
    }
    await (User as mongoose.Model<IUser>).findByIdAndUpdate(userId, {
      $set: { cart: null },
    });

    return NextResponse.json({
      message: "Order validated and placed successfully",
      success: true,
      order,
      shippingFee,
      totalAmount,
      items: processedItems,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
};
