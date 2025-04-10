import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { isAdmin } from "@/lib/middleware";

// GET ALL USERS
// GET /api/admin/user
export const GET = async (req: NextRequest) => {
  const isAdminMiddlewareResponse = await isAdmin(req);
  if (isAdminMiddlewareResponse) {
    return isAdminMiddlewareResponse;
  }
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt"; // Default: Sort by createdAt
    const order = searchParams.get("order") === "asc" ? 1 : -1; // Default: Descending order
    const skip = (page - 1) * limit;

    const users = await (User as mongoose.Model<IUser>)
      .find({ role: "user" })
      .select("-password")
      .sort({ [sortBy]: order }) // Dynamic sorting
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // ✅ Get total number of users for pagination meta info
    const totalUsers = await (User as mongoose.Model<IUser>).countDocuments({
      role: "user",
    });

    return NextResponse.json(
      {
        data: users,
        success: true,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          hasNextPage: page * limit < totalUsers,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", success: false, error: error },
      { status: 500 }
    );
  }
};
