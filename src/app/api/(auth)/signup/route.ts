import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import {
  ACCOUNT_CREATED_TEMPLATE,
  SEND_VERIFICATION_OTP_TEMPLATE,
} from "@/lib/nodemailer/emailTemplates";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password, name } = await req.json();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = email.toLowerCase();

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
    // Check if user with email exists
    const existingUser = await (User as mongoose.Model<IUser>)
      .findOne({ email: normalizedEmail })
      .exec();

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists", success: false },
          { status: 400 }
        );
      } else {
        // Delete unverified user
        await (User as mongoose.Model<IUser>).deleteOne({
          email: normalizedEmail,
        });
      }
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      isVerified: false,
      emailVerificationOTP: hashedOTP,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });

    await newUser.save();
    const {
      password: _,
      emailVerificationOTP,
      emailVerificationExpires,
      ...user
    } = newUser._doc;

    // Send OTP email
    await sendMail({
      to: normalizedEmail,
      subject: "Verify Your Email",
      html: SEND_VERIFICATION_OTP_TEMPLATE(name, otp),
    });
   
    return NextResponse.json(
      { message: "Account created", user, success: true },
      { status: 201 }
    );
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
