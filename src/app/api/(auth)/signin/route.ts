import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const normalizedEmail = email.toLowerCase();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await (User as mongoose.Model<IUser>)
      .findOne({ email: normalizedEmail })
      .exec();
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password", success: false },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password", success: false },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          message: "Account Disabled: Contact Vantek team at help@vantek.com",
          success: false,
        },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          message: "Email not verified. Please check your inbox.",
          success: false,
        },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { password: _, ...rest } = user.toObject();

    // Set JWT in HTTP-only cookie
    const response = NextResponse.json(
      { message: "Login successful", success: true, user: rest, token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60, // 7 days expiration
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
