import { Todo } from "~/db/interface";

type ServerResponse<T = unknown> = {
  data: T;
  statusCode: number;
  status: string;
  message?: string;
  error?: string;
};

type UserResponse = {
  id: number;
  name: string;
  email: string;
};

type TodoResponse = Omit<Todo, "updated_at" | "user_id">;

type HashMapPagination = { [key: string]: TodoResponse[] };

type TPaginationInfo = {
  pageSize: number;
  totalDataSize: number;
};

type TPaginationOption = {
  page: number;
  limit: number;
};

export {
  type ServerResponse,
  type UserResponse,
  type TodoResponse,
  type HashMapPagination,
  type TPaginationInfo,
  type TPaginationOption
};
