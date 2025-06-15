import connectDB from "@/lib/db";
import { CONTACT_FORM_TO_ADMIN_TEMPLATE } from "@/lib/nodemailer/emailTemplates";
import { sendMail } from "@/lib/nodemailer/nodemailer";
import { NextRequest, NextResponse } from "next/server";

// POST /api/me/contact-admin
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectDB();

    const { phone, subject, email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { message: "Name and message are required", success: false },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json(
        { message: "Admin email not found", success: false },
        { status: 500 }
      );
    }

    await sendMail({
      to: adminEmail,
      subject: "Contact Form Submission",
      html: CONTACT_FORM_TO_ADMIN_TEMPLATE(email, message, phone, subject),
    });

    return NextResponse.json(
      { message: "Email sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
