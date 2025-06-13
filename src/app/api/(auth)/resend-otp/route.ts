import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import crypto from "crypto";
import mongoose from "mongoose";
import { RESEND_VERIFICATION_OTP_TEMPLATE } from "@/lib/nodemailer/emailTemplates";

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required", success: false },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await (User as mongoose.Model<IUser>).findOne({
      email: new RegExp(`^${email}$`, "i"),
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email is already verified", success: false },
        { status: 400 }
      );
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP email
    await sendMail({
      to: user.email,
      subject: "Resend Verification OTP",
      html: RESEND_VERIFICATION_OTP_TEMPLATE(user.name, otp),
    });

    return NextResponse.json(
      { message: "OTP sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
