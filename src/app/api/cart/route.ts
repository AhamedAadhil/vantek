import connectDB from "@/lib/db";
import Cart, { ICart } from "@/lib/models/cart";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Product, { IProduct } from "@/lib/models/product";
import User, { IUser } from "@/lib/models/user";

// ADD PRODUCT TO CART
// POST /api/cart
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    let { userId, productId, quantity } = body;
    let cartUserId = userId;

    const product = await (Product as mongoose.Model<IProduct>)
      .findById(productId)
      .select("actualPrice");

    if (!product || typeof product.actualPrice !== "number") {
      return NextResponse.json(
        { message: "Invalid or missing product price" },
        { status: 400 }
      );
    }

    if (!productId || !product.actualPrice) {
      return NextResponse.json(
        { message: "Missing Product Detail" },
        { status: 400 }
      );
    }

    if (!quantity) {
      quantity = 1;
    }

    if (!userId) {
      let guestId = cookies().get("guestId")?.value;
      if (!guestId) {
        guestId = new mongoose.Types.ObjectId().toString();
        cookies().set("guestId", guestId, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
          httpOnly: true,
        }); //save guestId into cookies
      }
      cartUserId = guestId; //prefix with guest
    }

    let cart = await (Cart as mongoose.Model<ICart>).findOne({
      user: cartUserId,
    });

    if (!cart) {
      const newCart = new Cart({
        user: cartUserId,
        items: [{ product: productId, quantity }],
        totalPrice: product.actualPrice * quantity,
        totalItems: quantity,
      });
      await newCart.save();
      // If user is registered, update their document
      if (userId) {
        await (User as mongoose.Model<IUser>).findByIdAndUpdate(userId, {
          cart: newCart._id,
        });
      }
      return NextResponse.json(
        { data: newCart, success: true, message: "Product added to cart" },
        { status: 201 }
      );
    }

    // check if product already exist in cart
    const existingProductIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex > -1) {
      cart.items[existingProductIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    cart.totalPrice += product.actualPrice * quantity;
    cart.totalItems += quantity;
    cart.user = cartUserId;

    await cart.save();

    return NextResponse.json(
      { data: cart, success: true, message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE CART
// PATCH /api/cart
export async function PATCH(req: NextRequest) {
  const { action, userId, productId, quantity } = await req.json();

  try {
    await connectDB();
    if (action === "removeProduct") {
      // ✅ Fetch the cart first
      const cart = await (Cart as mongoose.Model<ICart>)
        .findOne({ user: userId })
        .populate("items.product", "actualPrice");

      if (!cart) {
        return NextResponse.json(
          { message: "Cart not found", success: false },
          { status: 404 }
        );
      }

      // ✅ Check if the product exists in the cart before removal
      const productIndex = cart.items.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productIndex === -1) {
        return NextResponse.json(
          { message: "Product not found in cart", success: false },
          { status: 404 }
        );
      }

      // ✅ Remove the product from the cart items array
      cart.items.splice(productIndex, 1);

      // ✅ Recalculate total price and total items
      cart.totalPrice = cart.items.reduce(
        (acc, item) =>
          acc + ((item.product as IProduct).actualPrice * item.quantity || 0),
        0
      );

      cart.totalItems = cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // ✅ Save the updated cart
      await cart.save();

      return NextResponse.json(
        { data: cart, success: true, message: "Product removed from cart" },
        { status: 200 }
      );
    }

    // ✅ Update product quantity in cart
    else if (action === "updateQuantity") {
      const cart = await (Cart as mongoose.Model<ICart>)
        .findOne({ user: userId })
        .populate("items.product", "actualPrice");

      if (!cart) {
        return NextResponse.json(
          { message: "Cart not found", success: false },
          { status: 404 }
        );
      }

      // Check if the product exists in the cart before updating quantity
      const productIndex = cart.items.findIndex(
        (item) => item.product._id.toString() === productId
      );
      if (productIndex === -1) {
        return NextResponse.json(
          { message: "Product not found in cart", success: false },
          { status: 404 }
        );
      }
      // Update the quantity of the product in the cart
      cart.items[productIndex].quantity = quantity;
      // Recalculate total price and total items
      cart.totalPrice = cart.items.reduce(
        (acc, item) =>
          acc + ((item.product as IProduct).actualPrice * item.quantity || 0),
        0
      );
      cart.totalItems = cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // ✅ Save the updated cart
      await cart.save();

      return NextResponse.json(
        { data: cart, success: true, message: "Product quantity updated" },
        { status: 200 }
      );
    }

    // ✅ Clear the cart
    else if (action === "clearCart") {
      const cart = await (Cart as mongoose.Model<ICart>).findOneAndDelete({
        user: userId,
      });

      if (!cart) {
        return NextResponse.json(
          { message: "Cart not found", success: false },
          { status: 404 }
        );
      }

      // ✅ Remove cart reference from the user
      await (User as mongoose.Model<IUser>).findByIdAndUpdate(userId, {
        $unset: { cart: "" }, // Removes the cart reference
      });

      return NextResponse.json(
        { data: cart, success: true, message: "Cart cleared" },
        { status: 200 }
      );
    }

    // ✅ Invalid Action type
    else {
      return NextResponse.json(
        { message: "Invalid action", success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
