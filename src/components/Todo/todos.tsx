"use client";

import { useQuery } from "@tanstack/react-query";
import { ServerResponse, TodoResponse } from "~/types";
import Loader from "~/components/Indicator/loader";
import Link from "next/link";
import TodoCard from "./card-todo";
import ViewTodoOption from "./view-todo-option";
import { useTodoPagination } from "./use-pagination";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import TodoPagination from "./todo-pagination";
// import { useTodoPagination } from "./use-pagination";
// import { useSearchParams } from "next/navigation";

async function getTodoData() {
  const url = process.env.NEXT_PUBLIC_APP_URL;

  const req = await fetch(url + "/api/todo", {
    method: "GET",
    credentials: "include"
  });

  const res = (await req.json()) as ServerResponse<TodoResponse[]>;
  return res.data;
}

export default function Todos() {
  const {
    isRefetching,
    isLoading,
    isError,
    data: todoData
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodoData,
    staleTime: 60 * 60 * 1000
  });

  const params = useSearchParams();

  const { limit, page } = useMemo(() => {
    return {
      limit: Number(params.get("limit") ?? 5),
      page: Number(params.get("page") ?? 1)
    };
  }, [params]);

  const { paginationData, updateOption, getSize } = useTodoPagination(
    todoData ?? [],
    limit
  );

  if (isLoading || isRefetching) return <Loader />;

  if (isError)
    return <div className="text-sm text-slate-200">Failed to load todos</div>;

  if (todoData && todoData.length === 0)
    return (
      <div className="text-sm px-2 ">
        No todos available,{" "}
        <Link
          href="/todo/new-todo"
          className="hover:underline text-blue-600 "
        >
          Create one
        </Link>
      </div>
    );

  return (
    <>
      <main className="flex flex-col gap-2 h-[450px] overflow-auto">
        {paginationData[page] &&
          paginationData[page].map((todo) => (
            <TodoCard
              todoData={todo}
              key={todo.id}
            />
          ))}
      </main>
      <div className="pt-5 mb-5 flex justify-center gap-2">
        <ViewTodoOption
          option={{
            limit,
            page
          }}
          updateOption={updateOption}
        />
        <TodoPagination
          option={{ limit, page }}
          updateOption={updateOption}
          paginationInfo={getSize()}
        />
      </div>
    </>
  );
}
