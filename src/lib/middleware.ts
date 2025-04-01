import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No access token provided", success: false },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized or Invalid Token", success: false },
        { status: 401 }
      );
    }
    // ✅ Manually attach user details to request headers
    req.headers.set("userId", decoded.userId);
    req.headers.set("email", decoded.email);
    req.headers.set("role", decoded.role);

    // If authentication is successful, return null (no error response)
    return null;

    /*
    this following approach is for global middleware
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userId", decoded.userId);
    requestHeaders.set("email", decoded.email);
    return NextResponse.next({ request: { headers: requestHeaders } });
    */
  } catch (error) {
    return NextResponse.json(
      { message: "Expired or Invalid Token", success: false },
      { status: 401 }
    );
  }
};
