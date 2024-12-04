import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookie = request.cookies;

  const accessToken = cookie.get("__token");
  const refreshToken = cookie.get("__ridtoken");

  const isAuthInvalid = !accessToken && !refreshToken;
  const url = new URL(request.url);

  if (
    (url.pathname === "/signin" || url.pathname === "/signup") &&
    isAuthInvalid
  ) {
    return NextResponse.next();
  }

  if (isAuthInvalid) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
