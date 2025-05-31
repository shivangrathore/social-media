import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const response = NextResponse.next();
  if (token) {
    response.headers.set("Authorization", "Bearer " + token.value);
  }
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
