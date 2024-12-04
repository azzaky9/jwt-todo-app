import { JwtPayload } from "./../../node_modules/@types/jsonwebtoken/index.d";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { User } from "~/db/interface";
import { pool } from "~/db/pg";
import { cookieOption } from "~/utils/cookie";

const accessTokenSecret = process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN!;
const refreshTokenSecret = process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN!;

const tokenEncoder = {
  secretToken: new TextEncoder().encode(accessTokenSecret),
  secretRefreshToken: new TextEncoder().encode(refreshTokenSecret)
};

const validateUser = async (email: string, password: string) => {
  const query = await pool.query<User>("SELECT * FROM users WHERE email = $1", [
    email
  ]);
  const user = query.rows[0];

  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }

  return null;
};

type TAuthPayload = {
  id: number;
  name: string;
};

const generateUserToken = async (tokenVerifierPayload: User) => {
  const payload = {
    id: tokenVerifierPayload.id,
    name: tokenVerifierPayload.name
  } as TAuthPayload;

  const accessToken = new jose.SignJWT(payload)
    .setExpirationTime("5m")
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(tokenEncoder.secretToken);

  const refreshToken = new jose.SignJWT(payload)
    .setExpirationTime("30d")
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(tokenEncoder.secretRefreshToken);

  return {
    accessToken,
    refreshToken
  };
};

async function verifyAcessToken(token: string) {
  try {
    const verify = await jose.jwtVerify<TAuthPayload>(
      token,
      tokenEncoder.secretToken
    );

    return verify;
  } catch (error) {
    if (error) {
      return null;
    }
  }
}

const decodeToken = async (token: string) => {
  const { payload } = await jose.jwtVerify(token, tokenEncoder.secretToken);
  return payload;
};

function verifyRefreshToken(
  token: string // refresh token,
) {
  return new Promise(async (resolve, reject) => {
    try {
      const { payload } = await jose.jwtVerify<User>(
        token,
        tokenEncoder.secretRefreshToken
      );

      const tokens = await generateUserToken(payload);

      resolve({ ...tokens, payload });
    } catch (error) {
      reject(error);
    }
  });
}

const requestWithAuthenticate = async (
  req: NextRequest,
  cookie: ReadonlyRequestCookies
) => {
  const accessToken = cookie.get("__token");
  const refreshToken = cookie.get("__ridtoken");

  const verifyAccess = await verifyAcessToken(accessToken?.value ?? "");

  if (verifyAccess) return verifyAccess.payload;

  if (refreshToken?.value) {
    try {
      const verifyRefresh = (await verifyRefreshToken(
        refreshToken?.value ?? ""
      )) as {
        accessToken: Promise<string>;
        refreshToken: Promise<string>;
        payload: TAuthPayload;
      };

      cookie.set("__token", await verifyRefresh.accessToken, cookieOption);

      return verifyRefresh.payload;
    } catch (error) {
      console.log("Verification failed", error);
      return null;
    }
  }

  return null;
};

export {
  validateUser,
  generateUserToken,
  verifyRefreshToken,
  verifyAcessToken,
  decodeToken,
  requestWithAuthenticate,
  type TAuthPayload
};
