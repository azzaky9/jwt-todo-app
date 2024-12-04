import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requestWithAuthenticate } from "~/service/auth";
import { getUserById, updateProfile } from "~/service/user";

export async function GET(req: NextRequest) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    try {
      const userData = await getUserById(payload.id);
      return NextResponse.json(
        {
          data: userData,
          statusCode: 200,
          status: "success"
        },
        { status: 200 }
      );
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      return NextResponse.json(
        {
          data: null,
          statusCode: 500,
          message: "internal server error"
        },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { statusCode: 401, status: "unauthorized" },
      { status: 401 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    try {
      const reqBody = await req.json();
      await updateProfile(payload.id, { fullName: reqBody.fullName });
      return NextResponse.json(
        {
          statusCode: 204,
          message: "profile update successfully"
        },
        { status: 204 }
      );
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      return NextResponse.json(
        {
          statusCode: 500,
          message: "Internal server error"
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
