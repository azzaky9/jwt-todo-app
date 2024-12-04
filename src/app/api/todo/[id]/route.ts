import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requestWithAuthenticate } from "~/service/auth";
import { deleteTodo, updateTodo } from "~/service/todo";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    try {
      const id = (await params).id;
      if (id) {
        await deleteTodo(Number(id), payload.id);

        return NextResponse.json(
          { message: "Todo deleted", status: "success" },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { message: "Failed to delete, invalid id", status: "error" },
        { status: 400 }
      );
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      return NextResponse.json(
        { message: "Failed to delete, internal server error", status: "error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ status: "unauthorized" }, { status: 401 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookie = await cookies();
  const payload = await requestWithAuthenticate(req, cookie);

  if (payload) {
    try {
      const id = (await params).id;
      const bodyRequest = await req.json();
      const path = req.nextUrl.searchParams.get("path");

      if (id) {
        await updateTodo(Number(id), payload.id, bodyRequest);

        revalidatePath(path ?? "");

        return NextResponse.json(
          { message: "Todo deleted", status: "success" },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { message: "Failed to delete, invalid id", status: "error" },
        { status: 400 }
      );
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      return NextResponse.json(
        { message: "Failed to delete, internal server error", status: "error" },
        { status: 500 }
      );
    }
  }
}
