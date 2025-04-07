import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Redirect if no token exists
  if (!token) {
    if (
      req.nextUrl.pathname.startsWith("/admin") || 
      req.nextUrl.pathname === "/my-account"||req.nextUrl.pathname ==="/wishlist"
    ) {
      return NextResponse.redirect(new URL("/signin", req.url)); // Redirect unauthenticated users to login page
    }
    return NextResponse.next(); // Allow unauthenticated requests for other paths
  }

  // Decode and verify token
  const decoded = jwt.decode(token, process.env.JWT_SECRET);

  // Check for the presence of a valid role
  const isAdmin = decoded?.role === "admin";
  const isUser = decoded?.role === "user";

  // Redirect unauthenticated users trying to access admin pages
  if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to home page
  }

  // Redirect unauthenticated users trying to access `/my-account` page
  if (req.nextUrl.pathname === "/my-account" && !(isAdmin || isUser)) {
    return NextResponse.redirect(new URL("/signin", req.url)); // Redirect to login page
  }

  return NextResponse.next(); // Allow request to continue
}

// Apply middleware to `/admin/*` routes and `/my-account`
export const config = {
  matcher: ["/admin/:path*", "/my-account","/wishlist"],
};