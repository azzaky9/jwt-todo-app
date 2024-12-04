import { cookies } from "next/headers";

const isProduction = process.env.NODE_ENV === "production";

const cookieOption = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: isProduction,
  domain: isProduction ? `${process.env.PRODUCTION_DOMAIN}` : "",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 year
} as const;

const clearCookie = async () => {
  const cookie = await cookies();
  cookie.delete("__token");
  cookie.delete("__ridtoken");
};

export { clearCookie, cookieOption };
