// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import aj from "@/lib/arcjet";
// import { isSpoofedBot } from "@arcjet/inspect";

// // NOTE: Use a lightweight JWT decoder for Edge
// function decodeJWT(token: string): any {
//   try {
//     const base64Payload = token.split(".")[1];
//     const payload = atob(base64Payload);
//     return JSON.parse(payload);
//   } catch (err) {
//     return null;
//   }
// }

// export async function middleware(req: NextRequest) {
//   // 👉 Arcjet protection
//   const decision = await aj.protect(req, { requested: 1 });

//   if (decision.isDenied()) {
//     const reason = decision.reason;
//     const status = reason.isRateLimit() ? 429 : 403;
//     const message = reason.isRateLimit()
//       ? "Too Many Requests"
//       : reason.isBot()
//       ? "No bots allowed"
//       : "Forbidden";

//     return NextResponse.json({ error: message, reason }, { status });
//   }

//   if (decision.results.some(isSpoofedBot)) {
//     return NextResponse.json(
//       { error: "Forbidden - Spoofed bot detected" },
//       { status: 403 }
//     );
//   }

//   // 👉 JWT-based Auth
//   const token = req.cookies.get("token")?.value;
//   const { pathname } = req.nextUrl;

//   if (!token) {
//     if (
//       pathname.startsWith("/admin") ||
//       pathname === "/my-account" ||
//       pathname === "/wishlist"
//     ) {
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }
//     return NextResponse.next();
//   }

//   // ✅ Decode the token manually
//   const decoded = decodeJWT(token);
//   const role = decoded?.role;

//   const isAdmin = role === "admin";
//   const isUser = role === "user";

//   if (pathname.startsWith("/admin") && !isAdmin) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   if (pathname === "/my-account" && !(isAdmin || isUser)) {
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/my-account", "/wishlist", "/api/:path*"],
// };


// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight JWT decoder for Edge Runtime
function decodeJWT(token: string): any {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    if (
      pathname.startsWith("/admin") ||
      pathname === "/my-account" ||
      pathname === "/wishlist"
    ) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  const decoded = decodeJWT(token);
  const role = decoded?.role;

  const isAdmin = role === "admin";
  const isUser = role === "user";

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/my-account" && !(isAdmin || isUser)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/my-account", "/wishlist", "/api/:path*"],
};
