import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const decoded = jwt.decode(token,process.env.JWT_SECRET);
  const isAdmin = decoded.role==="admin"

  // Redirect unauthenticated users trying to access admin pages
  if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
     return NextResponse.next();  // Allow request to continue
 
}

// Apply middleware only to `/admin/*` routes
export const config = {
  matcher: ["/admin/:path*"],
};
