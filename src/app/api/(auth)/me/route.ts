import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  // ✅ Use the authMiddleware to check if the request is authenticated
  const authMiddlewareResponse = await authMiddleware(req);
  if (authMiddlewareResponse) {
    return authMiddlewareResponse;
  }
  try {
    await connectDB();
    const userId = req.headers.get("userId");
    const userProfile = await User.findById(userId).exec();
    if (!userProfile) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }
    const { password: _, ...rest } = userProfile._doc;
    return NextResponse.json({ user: rest }, { status: 200 });
  } catch (error: any) {
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
