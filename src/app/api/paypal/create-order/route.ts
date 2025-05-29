import { NextRequest, NextResponse } from "next/server";

// /api/paypal/create-order
export const POST = async (req: NextRequest) => {
  try {
    const { amount } = await req.json();

    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { message: "Invalid or missing amount." },
        { status: 400 }
      );
    }

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: amount.toString(),
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message: "Failed to create PayPal order",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.id) {
      return NextResponse.json(
        { message: "PayPal order ID missing from response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ paypalOrderId: data.id });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json(
      { message: "Internal server error while creating PayPal order." },
      { status: 500 }
    );
  }
};
