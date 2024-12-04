"use server";

import * as v from "valibot";
import { LoginSchema } from "~/lib/validation/auth";
import { generateUserToken } from "~/service/auth";
import { getUser } from "~/service/user";
import { pool } from "~/db/pg";
import { RegisterSchema } from "~/lib/validation/auth";
import { makeErrorObject } from "~/utils/use-error";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cookieOption } from "~/utils/cookie";
import bcrypt from "bcryptjs";

export type InitialErrorResponse = { [key: string]: string };

export async function register(
  prevState: InitialErrorResponse,
  formData: FormData
) {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string
  };
  const validate = v.safeParse(RegisterSchema, raw);
  const error = {} as { [key: string]: string };
  const readable = makeErrorObject(validate);

  if (validate.success) {
    const { fullName, email, password } = validate.output;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const duplicate = await pool.query(
        `SELECT email FROM users WHERE email = $1`,
        [email]
      );

      if (duplicate.rows.length > 0) {
        error.email = "already exists";
        return error;
      }

      await pool.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
        [fullName, email, hashedPassword]
      );
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        error.failed = "Unable to create user, try again later";
      }
    }

    redirect("/signin");
  }

  return !validate.success ? readable : error;
}

export async function signin(
  prevState: InitialErrorResponse,
  formData: FormData
) {
  const cookie = await cookies();
  const error = {} as InitialErrorResponse;

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string
  };

  const validate = v.safeParse(LoginSchema, raw);
  const readable = makeErrorObject(validate);

  if (validate.success) {
    const { email } = validate.output;

    try {
      const user = await getUser(email);
      if (!user) {
        error.failed =
          "Not found user with email " + email + ", please register first";
        return error;
      }
      const verify = await bcrypt.compare(raw.password, user.password);

      if (!verify) {
        error.Failed = "wrong credential, please double check your credential";
        return error;
      }

      const { accessToken, refreshToken } = await generateUserToken(user);

      cookie.set("__token", await accessToken, cookieOption);
      cookie.set("__ridtoken", await refreshToken, cookieOption);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }

    redirect("/");
  }

  return !validate.success ? readable : error;
}

export async function signout() {
  const cookie = await cookies();
  cookie.set("__token", "", { maxAge: 0 });
  cookie.set("__ridtoken", "", { maxAge: 0 });
  redirect("/signin");
}
