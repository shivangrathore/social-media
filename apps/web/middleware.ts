import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("token");

  // Handle API routes: inject Authorization header if token is present
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    if (token) {
      response.headers.set("Authorization", `Bearer ${token.value}`);
    }
    return response;
  }

  // Authenticated route handling
  try {
    console.log(token?.value);
    await apiClient.get("/users/@me", {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    // Redirect logged-in users away from auth pages
    if (pathname === "/login" || pathname === "/register") {
      const next = searchParams.get("next") || "/";
      return NextResponse.redirect(new URL(next, request.url));
    }

    return NextResponse.next();
  } catch {
    console.log("Not logged in");

    // Allow unauthenticated access to the login page
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    const response = NextResponse.redirect(loginUrl);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next|static).*)"],
};
