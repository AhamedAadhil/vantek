import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email }).exec();
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
        { message: "User is inactive", success: false },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { password: _, ...rest } = user._doc;

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

    // await sendMail(
    //   user.email,
    //   "Login Notification",
    //   `<p>Hello ${user.name},<br><br>Your account was just logged into from a new device. If this was you, you can safely ignore this email. If you suspect any suspicious activity on your account, please contact support immediately.</p>`
    // );

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
