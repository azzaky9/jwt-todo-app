import * as v from "valibot";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createTodoSchema } from "~/lib/validation/todo";
import { requestWithAuthenticate } from "~/service/auth";
import { createTodo, getTodos } from "~/service/todo";
import { makeErrorObject } from "~/utils/use-error";

export async function GET(req: NextRequest) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    const todoData = await getTodos(payload.id);

    return NextResponse.json(
      {
        data: todoData,
        statusCode: 200,
        status: "success"
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { statusCode: 401, status: "unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    const bodyRequest = await req.json();
    const validate = v.safeParse(createTodoSchema, bodyRequest);

    if (!validate.success) {
      const errors = makeErrorObject(validate);

      return NextResponse.json(
        {
          statusCode: 400,
          status: "error",
          message: "validation error",
          error: Object.entries(errors).map(
            ([key, value]) => `${key}: ${value}`
          )
        },
        { status: 400 }
      );
    }

    try {
      await createTodo(payload.id, validate.output);

      return NextResponse.json(
        {
          statusCode: 201,
          status: "success",
          message: `task ${validate.output.title} created`
        },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
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
