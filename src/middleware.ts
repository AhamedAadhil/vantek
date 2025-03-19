import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAdminLoggedIn = req.cookies.get("admin_token");  // Check admin auth

  // Redirect unauthenticated users trying to access admin pages
  if (req.nextUrl.pathname.startsWith("/signin") && !isAdminLoggedIn) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();  // Allow request to continue
}

// Apply middleware only to `/admin/*` routes
export const config = {
  matcher: ["/signin"],
};