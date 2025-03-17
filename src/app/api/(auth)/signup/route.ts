import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      {
        message: "Email, password, and name are required",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const isUserExist = await User.findOne({ email }).exec();
    if (isUserExist) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    // TODO: gen jwt
    await newUser.save();
    const { password: _, ...user } = newUser._doc;
    return NextResponse.json(
      { message: "Account created", data: user, success: true },
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
