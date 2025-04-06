import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminLoggedIn = true
//   req.cookies.get("admin_token");  // Check admin auth

  // Redirect unauthenticated users trying to access admin pages
  if (req.nextUrl.pathname.startsWith("/admin") && !isAdminLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();  // Allow request to continue
}

// Apply middleware only to `/admin/*` routes
export const config = {
  matcher: ["/admin/:path*"],
};
