import TodoForm from "~/components/Forms/todo-form";

export default function Page() {
  const initial = {};
  return (
    <div className="w-full grid place-content-center">
      <TodoForm
        formTitle="Create New Todo"
        formType="create"
        todoInitialData={initial}
      />
    </div>
  );
}
