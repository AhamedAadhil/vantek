import connectDB from "@/lib/db";
import User, { IUser } from "@/lib/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/utils/createPasswordResetToken";
import { PASSWORDRESET_EMAIL_TEMPLATE } from "@/lib/nodemailer/emailTemplates";
import { sendMail } from "@/lib/nodemailer/nodemailer";

// /api/forgot-password
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required", success: false },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await (User as mongoose.Model<IUser>).findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // generate a reset token and send an email
    const { rawToken, hashedToken, expiresAt } =
      await createPasswordResetToken();

    user.resetToken = hashedToken;
    user.resetTokenexpiresAt = expiresAt;
    await user.save();

    // generate a reset link
    const resetLink = `${
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASEURL_FRONTEND
        : process.env.NEXT_PUBLIC_BASEURL_LOCAL_FRONTEND
    }/reset-password?token=${rawToken}&id=${user._id}`;

    // send email
    const emailConntent = PASSWORDRESET_EMAIL_TEMPLATE(resetLink, user.name);
    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailConntent,
    });
    return NextResponse.json(
      { message: "Password reset link sent to your email", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password API:", error);
    return NextResponse.json(
      {
        message: "Failed to process request",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
