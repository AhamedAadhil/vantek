import connectDB from "@/lib/db";
import Cart, { ICart } from "@/lib/models/cart";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Product, { IProduct } from "@/lib/models/product";
import User, { IUser } from "@/lib/models/user";
import { getVariantPrice } from "../../../../utils/getVariantPrice";
import { cleanCart } from "../../../../utils/cleanCart";

// ADD PRODUCT TO CART
// POST /api/cart
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    let { userId, productId, variantId, quantity } = body;
    // const objectProductId = new mongoose.Types.ObjectId(productId);
    // const objectVariantId = new mongoose.Types.ObjectId(variantId);

    let cartUserId = userId;

    const product = await (Product as mongoose.Model<IProduct>).findById(
      productId
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    const selectedVariant = product.variants.find(
      (v) => v._id.toString() === variantId.toString()
    );

    if (!selectedVariant) {
      return NextResponse.json(
        { message: "Variant not found" },
        { status: 404 }
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
        items: [
          {
            product: productId,
            variantId: selectedVariant._id,
            quantity,
          },
        ],
        totalPrice: selectedVariant.actualPrice * quantity,
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
      (item) =>
        item.product.toString() === productId.toString() &&
        item.variantId.toString() === variantId.toString()
    );

    if (existingProductIndex > -1) {
      cart.items[existingProductIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variantId: selectedVariant._id,
        quantity,
      });
    }
    cart.totalPrice += selectedVariant.actualPrice * quantity;
    cart.totalItems += quantity;
    cart.user = cartUserId;

    await cart.save();

    await cart.populate("items.product", "title image"); // Only populate fields you need
    await cart.populate("items.variantId", "actualPrice");

    return NextResponse.json(
      { data: cart, success: true, message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", success: false, error: error },
      { status: 500 }
    );
  }
}

// UPDATE CART
// PATCH /api/cart
export async function PATCH(req: NextRequest) {
  const { action, userId, productId, variantId, quantity } = await req.json();

  try {
    await connectDB();
    if (action === "removeProduct") {
      // ✅ Fetch the cart first
      const cart = await (Cart as mongoose.Model<ICart>)
        .findOne({ user: userId })
        .populate("items.product", "title variants");

      if (!cart) {
        return NextResponse.json(
          { message: "Cart not found", success: false },
          { status: 404 }
        );
      }

      // ✅ Check if the product exists in the cart before removal
      const productIndex = cart.items.findIndex(
        (item) =>
          item.product._id.toString() === productId &&
          item.variantId.toString() === variantId
      );

      if (productIndex === -1) {
        return NextResponse.json(
          { message: "Product not found in cart", success: false },
          { status: 404 }
        );
      }

      // ✅ Remove the product from the cart items array
      cart.items.splice(productIndex, 1);

      // ✅ Recalculate total price
      cart.totalPrice = cart.items.reduce((acc, item) => {
        const prod: any = item.product;
        const price = getVariantPrice(prod, item.variantId.toString());
        return acc + price * item.quantity;
      }, 0);

      // ✅ Recalculate total items
      cart.totalItems = cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // ✅ Save the updated cart
      await cart.save();

      await cart.populate("items.product", "title image");
      await cart.populate("items.variantId", "actualPrice");

      const cleanedCart = cleanCart(cart);

      return NextResponse.json(
        {
          data: cleanedCart,
          success: true,
          message: "Product removed from cart",
        },
        { status: 200 }
      );
    }

    // ✅ Update product quantity in cart
    else if (action === "updateQuantity") {
      const cart = await (Cart as mongoose.Model<ICart>)
        .findOne({ user: userId })
        .populate("items.product", "title variants"); // also get variants now

      if (!cart) {
        return NextResponse.json(
          { message: "Cart not found", success: false },
          { status: 404 }
        );
      }

      // Check if the product exists in the cart before updating quantity
      const productIndex = cart.items.findIndex(
        (item) =>
          item.product._id.toString() === productId &&
          item.variantId.toString() === variantId
      );
      if (productIndex === -1) {
        return NextResponse.json(
          { message: "Product not found in cart", success: false },
          { status: 404 }
        );
      }
      // Update the quantity of the product in the cart
      cart.items[productIndex].quantity = quantity;

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((acc, item) => {
        const prod: any = item.product;
        const price = getVariantPrice(prod, item.variantId.toString());
        return acc + price * item.quantity;
      }, 0);

      // Recalculate total items
      cart.totalItems = cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // ✅ Save the updated cart
      await cart.save();

      await cart.populate("items.product", "title image");
      await cart.populate("items.variantId", "actualPrice");

      const cleanedCart = cleanCart(cart);

      return NextResponse.json(
        {
          data: cleanedCart,
          success: true,
          message: "Product quantity updated",
        },
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
