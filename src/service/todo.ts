import { Todo } from "~/db/interface";
import { pool } from "~/db/pg";
import { TCreateTodoDto } from "~/lib/validation/todo";

export async function createTodo(userId: number, todoData: TCreateTodoDto) {
  return await pool.query(
    "INSERT INTO todo (title, description, status, user_id, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      todoData.title,
      todoData.description,
      todoData.status,
      userId,
      new Date(todoData.deadline)
    ]
  );
}

export async function getTodos(userId: number) {
  const query = await pool.query<Todo>(
    "SELECT id, title, description, status, deadline, created_at FROM todo WHERE user_id = $1",
    [userId]
  );

  return query.rows;
}

export async function getTodoById(todoId: number) {
  const query = await pool.query<Todo>(
    "SELECT id, title, description, status, deadline, created_at, updated_at FROM todo WHERE id = $1",
    [todoId]
  );

  return query.rows[0] ? query.rows[0] : null;
}

export async function deleteTodo(todoId: number, userId: number) {
  return await pool.query("DELETE FROM todo WHERE id = $1 AND user_id = $2", [
    todoId,
    userId
  ]);
}

export async function updateTodo(
  todoId: number,
  userId: number,
  updatedData: Partial<TCreateTodoDto>
) {
  const fields = Object.keys(updatedData)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedData);

  return await pool.query(
    `UPDATE todo SET ${fields} WHERE id = $${
      values.length + 1
    } AND user_id = $${values.length + 2} RETURNING *`,
    [...values, todoId, userId]
  );
}
