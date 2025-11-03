import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

    // Allow auth pages without authentication
    if (isAuthPage) {
      return NextResponse.next();
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAuth || token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all requests to proceed to the middleware function
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/checkout/:path*",
  ],
};
