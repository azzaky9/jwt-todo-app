"use client";

import { TodoResponse } from "~/types";
import TodoStatus from "./status-todo";
import Link from "next/link";
import { Clock } from "lucide-react";

type Props = {
  todoData: TodoResponse;
};

export default function TodoCard({ todoData }: Props) {
  return (
    <Link
      href={`/todo/${todoData.id}`}
      className="mx-20"
    >
      <div className="bg-white flex justify-between items-center shadow-sm rounded-lg p-4 border transition-all duration-300 hover:scale-105 relative cursor-pointer">
        <div>
          <div className="flex gap-3 my-1">
            <h2 className="text-xl font-semibold">{todoData.title}</h2>
            <TodoStatus status={todoData.status} />
          </div>
          <div className="w-[60px]">
            <p className="text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
              {todoData.description}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            <span className="text-sm">
              {new Date(todoData.deadline).toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
