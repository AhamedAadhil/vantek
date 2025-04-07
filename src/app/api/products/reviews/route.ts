import { NextRequest, NextResponse } from "next/server";

// CREATE REVIEW
// POST /api/products/reviews

// TODO: CREATE CART and CHECKOUT API FIRST
// TODO: SO THAT WE CAN ENSURE THAT THE USER IS PURCHASED THAT PRODUCT BEFORE GIVING REVIEW
export const POST = async (req: NextRequest) => {
  const { productId, review, orderId } = await req.json();
  console.log(productId, review, orderId);
  try {
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while posting review",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
};
