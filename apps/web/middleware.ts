import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("token");

  if (pathname.startsWith("/api/") || pathname.startsWith("/socket.io")) {
    const response = NextResponse.next();
    if (token) {
      response.headers.set("Authorization", `Bearer ${token.value}`);
    }
    return response;
  }

  try {
    await apiClient.get("/users/@me", {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    if (pathname === "/login" || pathname === "/register") {
      const next = searchParams.get("next") || "/";
      return NextResponse.redirect(new URL(next, request.url));
    }

    return NextResponse.next();
  } catch {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    const response = NextResponse.redirect(loginUrl);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next|static).*)"],
};
