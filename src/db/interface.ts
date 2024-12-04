interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

type TodoStatus = "pending" | "complete";

interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  deadline: Date;
  created_at: Date;
  updated_at: Date;
}

export type { User, Todo, TodoStatus };
