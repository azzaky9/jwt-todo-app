"use client";

import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import {
  TCreateTodoDto,
  TUpdateTodoDto,
  createTodoSchema,
  updateTodoSchema
} from "~/lib/validation/todo";

import Input from "./input";
import HelperInput from "~/components/Indicator/helper-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerResponse } from "~/types";
import { toast } from "sonner";
import { useErrorTransform } from "./use-transform";

import CantEdit from "../Indicator/cant-edit";
import { useRouter } from "next/navigation";

async function createTodo(todoData: TCreateTodoDto) {
  const url = process.env.NEXT_PUBLIC_APP_URL;

  const requestData = JSON.stringify(todoData);
  const req = await fetch(url + "/api/todo", {
    body: requestData,
    credentials: "include",
    method: "POST"
  });
  const res = (await req.json()) as ServerResponse;

  return res;
}

async function updateTodo(todoData: TUpdateTodoDto & { todoId: number }) {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  const { todoId, ...todo } = todoData;

  const requestData = JSON.stringify(todo);
  const req = await fetch(url + `/api/todo/${todoId}`, {
    body: requestData,
    credentials: "include",
    method: "PUT"
  });
  const res = (await req.json()) as ServerResponse;

  return res;
}

type Props = {
  formTitle: string;
  formType: "create" | "update";
  todoInitialData: Partial<TCreateTodoDto & { todoId: number }>;
};

export default function TodoForm({
  todoInitialData,
  formTitle,
  formType
}: Props) {
  const globalQuery = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-todo"],
    mutationFn: createTodo,
    onSuccess: () => {
      toast.success("Todo created");
      globalQuery.refetchQueries({ queryKey: ["todos"] });
    },
    onError: () => toast.error("Failed to create todo")
  });

  const { mutateAsync: editTodo, isPending: isEditing } = useMutation({
    mutationKey: ["update-todo"],
    mutationFn: updateTodo,
    onSuccess: () => {
      toast.success("Todo updated");
      globalQuery.refetchQueries({ queryKey: ["todos"] });
      router.push(`/todo/${todoInitialData.todoId}`);
    },
    onError: () => toast.error("Failed to update todo")
  });

  const getInitialData = (key: keyof TCreateTodoDto) =>
    todoInitialData[key] ?? "";

  const getValidation = () => {
    return formType === "create" ? createTodoSchema : updateTodoSchema;
  };

  const getSubmitLabel = () =>
    formType === "create" ? "Create Task" : "Update Task";

  const form = useForm({
    defaultValues: {
      title: getInitialData("title"),
      description: getInitialData("description"),
      deadline: getInitialData("deadline"),
      status: getInitialData("status") ? getInitialData("status") : "pending"
    } as TCreateTodoDto,
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: getValidation(),
      onSubmit: getValidation()
    },
    onSubmit: async ({ value, formApi }) => {
      if (formType === "create") {
        await mutateAsync(value);
        formApi.reset();
      }

      if (formType === "update" && todoInitialData.todoId) {
        await editTodo({
          ...value,
          todoId: todoInitialData.todoId
        });

        formApi.reset();
      }
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    form.handleSubmit();
  };

  const { getInputStatus } = useErrorTransform();

  const isTaskComplete = form.getFieldValue("status") === "complete";

  return (
    <div className="mt-2 px-6 pt-4 pb-8 w-[520px] bg-white rounded-md border border-1 ">
      <div className="my-2 pb-4">
        <h1 className="text-lg">{formTitle}</h1>
        {isTaskComplete && <CantEdit />}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-y-3 gap-x-2">
          <div>
            <form.Field name="title">
              {({ name, handleBlur, handleChange, state }) => {
                const { invalid, messageOnChange, messageOnSubmit } =
                  getInputStatus(state);

                return (
                  <>
                    <Input
                      label="Title"
                      id="title"
                      type="text"
                      disabled={isPending || isEditing || isTaskComplete}
                      invalid={invalid}
                      name={name}
                      value={state.value}
                      onChange={(e) => handleChange(e.currentTarget.value)}
                      onBlur={handleBlur}
                    />
                    <HelperInput
                      message={messageOnChange || messageOnSubmit}
                      renderif={invalid}
                    />
                  </>
                );
              }}
            </form.Field>
          </div>
          <div>
            <form.Field name="description">
              {({ name, handleBlur, handleChange, state }) => {
                const { invalid, messageOnChange, messageOnSubmit } =
                  getInputStatus(state);

                return (
                  <>
                    <Input
                      label="Description"
                      id="description"
                      type="text"
                      invalid={invalid}
                      disabled={isPending || isEditing || isTaskComplete}
                      name={name}
                      value={state.value}
                      onChange={(e) => handleChange(e.currentTarget.value)}
                      onBlur={handleBlur}
                    />
                    <HelperInput
                      message={messageOnChange || messageOnSubmit}
                      renderif={invalid}
                    />
                  </>
                );
              }}
            </form.Field>
          </div>
          <div>
            <form.Field name="deadline">
              {({ name, handleBlur, handleChange, state }) => {
                const { invalid, messageOnChange, messageOnSubmit } =
                  getInputStatus(state);

                return (
                  <>
                    <Input
                      label="Deadline Task"
                      id="description"
                      disabled={isPending || isEditing || isTaskComplete}
                      type="date"
                      invalid={invalid}
                      name={name}
                      value={state.value}
                      onChange={(e) => handleChange(e.currentTarget.value)}
                      onBlur={handleBlur}
                    />
                    <HelperInput
                      message={messageOnChange || messageOnSubmit}
                      renderif={invalid}
                    />
                  </>
                );
              }}
            </form.Field>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-1">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isEditing || isPending || isSubmitting}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Go Back
                </button>
                <button
                  disabled={
                    !canSubmit || isSubmitting || isEditing || isTaskComplete
                  }
                  type="submit"
                  className="btn btn-secondary disabled:opacity-50"
                >
                  {getSubmitLabel()}
                </button>
              </>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
