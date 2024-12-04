import TodoForm from "~/components/Forms/todo-form";
import { getTodoById } from "~/service/todo";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const todo = await getTodoById(Number(id));

  if (!todo) return <p>Todo with {id} not found</p>;

  const initialData = {
    title: todo.title,
    description: todo.description,
    deadline: new Date(todo.deadline).toISOString().split("T")[0],
    status: todo.status
  };

  return (
    <div className="w-full grid place-content-center">
      <TodoForm
        formTitle="Edit Todo"
        formType="update"
        todoInitialData={{ ...initialData, todoId: Number(id) }}
      />
    </div>
  );
}
