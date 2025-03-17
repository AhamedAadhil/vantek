import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  await connectDB();
  return new NextResponse("Hello from signin route");
};
