import Link from "next/link";
import DetailCardTodo from "~/components/Todo/detail-todo";
import { getTodoById } from "~/service/todo";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = await getTodoById(Number(id));

  return data ? (
    <div className="flex flex-col justify-end">
      <DetailCardTodo todoData={data} />
      <Link
        href="/"
        className="self-end mx-20 mt-2"
      >
        <button className="btn btn-secondary w-fit ">Go back</button>
      </Link>
    </div>
  ) : (
    <div className="text-sm ">
      Task not found,{" "}
      <Link
        href="/"
        className="text-blue-500 underline text-sm"
      >
        Go back
      </Link>
    </div>
  );
}
