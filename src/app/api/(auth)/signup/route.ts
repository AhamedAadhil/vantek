import connectDB from "@/lib/db";
import { authMiddleware } from "@/lib/middleware";
import User, { IUser } from "@/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password, name } = await req.json();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !name) {
    return NextResponse.json(
      {
        message: "Email, password, and name are required",
        success: false,
      },
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      {
        message: "Please enter a valid email address",
        success: false,
      },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      {
        message: "Password must be at least 6 characters long",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const isUserExist = await (User as mongoose.Model<IUser>)
      .findOne({ email })
      .exec();
    if (isUserExist) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    // gen jwt
    // const token = jwt.sign(
    //   {
    //     email: newUser.email,
    //     id: newUser._id,
    //     role: newUser.role,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    await newUser.save();
    const { password: _, ...user } = newUser._doc;

    return NextResponse.json(
      { message: "Account created", user, success: true },
      { status: 201 }
    );

    // set cookie
    // response.cookies.set("token", token, {
    //   httpOnly: true, // Prevents client-side access
    //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    //   sameSite: "strict", // Prevents CSRF attacks
    //   maxAge: 7 * 24 * 60 * 60, // 7 days expiration
    // });

    // ✅ Manually attach user details to request headers
    // req.headers.set("userId", newUser.userId);
    // req.headers.set("email", newUser.email);
    // req.headers.set("role", newUser.role);
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
