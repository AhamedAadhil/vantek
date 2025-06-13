import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import { ACCOUNT_CREATED_TEMPLATE } from "@/lib/nodemailer/emailTemplates";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json(
      { message: "Email and OTP are required", success: false },
      { status: 400 }
    );
  }

  await connectDB();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await (User as mongoose.Model<IUser>).findOne({
    email: new RegExp(`^${email}$`, "i"),
    emailVerificationOTP: hashedOTP,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired OTP", success: false },
      { status: 400 }
    );
  }

  user.isVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  await sendMail({
    to: email,
    subject: "Account Created Successfully",
    html: ACCOUNT_CREATED_TEMPLATE(user.name, email),
  });

  return NextResponse.json(
    {
      message: "Email verified successfully",
      success: true,
    },
    {
      status: 200,
    }
  );
};
