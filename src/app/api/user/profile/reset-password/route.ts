import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requestWithAuthenticate } from "~/service/auth";
import { resetPassword } from "~/service/user";

export async function POST(req: NextRequest) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    try {
      const reqBody = await req.json();
      const resetComplete = await resetPassword(payload.id, reqBody);

      if (resetComplete) {
        return NextResponse.json(
          {
            statusCode: 200,
            message: "password updated"
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            statusCode: 400,
            message: "failed to update, your old password not match"
          },
          { status: 400 }
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
      return NextResponse.json(
        {
          statusCode: 500,
          message: "server error"
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      statusCode: 401,
      message: "unauthorized"
    },
    { status: 401 }
  );
}
