import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "@/lib/nodemailer/emailTemplates";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, token, password } = await req.json();
    if (!userId || !token || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await (User as mongoose.Model<IUser>).findById(userId);
    if (!user || !user.resetToken || !user.resetTokenexpiresAt) {
      return NextResponse.json(
        { message: "Invalid or expired link" },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const isValid =
      user.resetToken === hashedToken && user.resetTokenexpiresAt > new Date();

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenexpiresAt = undefined;
    await user.save();

    const mailContent = PASSWORD_RESET_SUCCESS_TEMPLATE(user.name);

    await sendMail({
      to: user.email,
      subject: "Password Reset Successful",
      html: mailContent,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
