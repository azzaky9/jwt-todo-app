"use client";

import React from "react";
import { Trash2, CheckCircle, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const url = process.env.NEXT_PUBLIC_APP_URL;

async function deleteTodo(todoId: number) {
  const req = await fetch(url + `/api/todo/${todoId}`, {
    method: "DELETE",
    credentials: "include"
  });
  const res = await req.json();

  return res;
}

async function markasCompeteTodo(todoId: number) {
  const req = await fetch(url + `/api/todo/${todoId}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({ status: "complete" })
  });

  const res = await req.json();

  return res;
}

export default function TodoAction({
  todoId,
  status
}: {
  todoId: number;
  status: "pending" | "complete";
}) {
  const globalQuery = useQueryClient();
  const router = useRouter();

  const requestSuccess = (message: string, direct?: boolean) => {
    toast.success(message);
    globalQuery.refetchQueries({ queryKey: ["todos"] });
    router.refresh();
    if (direct) router.replace("/", { scroll: false });
  };

  const { mutate: deleteById, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-todo"],
    mutationFn: deleteTodo,
    onSuccess: () => requestSuccess("Todo deleted", false),
    onError: () => toast.error("Failed to delete todo")
  });

  const { mutate: markAsComplete, isPending: isUpdating } = useMutation({
    mutationKey: ["mark-as-complete"],
    mutationFn: markasCompeteTodo,
    onSuccess: () => {
      requestSuccess("Todo marked as complete", false);
    },
    onError: () => toast.error("Failed to mark as complete")
  });

  const isTaskComplete = status === "complete";

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => deleteById(todoId)}
        disabled={isDeleting}
        className="btn-icon btn-secondary  text-sm flex gap-2 justify-center items-center disabled:opacity-50"
      >
        <Trash2 className="icon h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClickCapture={() => markAsComplete(todoId)}
        disabled={isUpdating || isTaskComplete}
        className="btn-icon btn-secondary px-0.5 text-sm flex gap-2 justify-center items-center disabled:opacity-50"
      >
        <CheckCircle className="icon h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={isTaskComplete}
        onClick={() => router.push(`/todo/${todoId}/edit`, { scroll: false })}
        className="btn-icon btn-secondary px-0.5 text-sm flex gap-2 justify-center items-center disabled:opacity-50 disbled:hover:bg-gray-200"
      >
        <Edit className="icon h-3.5 w-3.5" />
      </button>
    </div>
  );
}
