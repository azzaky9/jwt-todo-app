"use client";

import { Todo } from "~/db/interface";
import TodoStatus from "./status-todo";

import { Clock, PlusCircle } from "lucide-react";
import TodoAction from "./action-todo";

type Props = {
  todoData: Todo;
};

export default function DetailCardTodo({ todoData }: Props) {
  return (
    <div className="bg-white flex justify-between items-center shadow-sm rounded-lg p-4 border transition-all duration-300 mx-20 ">
      <div>
        <div className="flex gap-3 my-1">
          <h2 className="text-xl font-semibold">{todoData.title}</h2>
          <TodoStatus status={todoData.status} />
        </div>
        <p className="text-sm text-gray-500  max-w-[620px] w-full break-words">
          {todoData.description}
        </p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            <span className="text-sm">
              {new Date(todoData.deadline).toLocaleDateString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <PlusCircle size={16} />
            <span className="text-sm">
              {new Date(todoData.created_at).toLocaleDateString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm">Last Updated task at - </span>
            <span className="text-sm">
              {new Date(todoData.updated_at).toLocaleDateString("id-ID")}{" "}
              {new Date(todoData.updated_at).toLocaleTimeString("id-ID")}
            </span>
          </div>
        </div>
      </div>
      <div>
        <TodoAction
          todoId={todoData.id}
          status={todoData.status}
        />
      </div>
    </div>
  );
}
