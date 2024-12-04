import * as v from "valibot";

const Status = {
  complete: "complete",
  pending: "pending"
} as const;

const createTodoSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(3, "Title must be have minimum 3 character")
  ),
  description: v.pipe(v.string(), v.maxLength(1000), v.trim()),
  deadline: v.pipe(v.string(), v.isoDate()),
  status: v.pipe(v.string(), v.enum(Status))
});

type TCreateTodoDto = v.InferInput<typeof createTodoSchema>;

const updateTodoSchema = v.partial(createTodoSchema, [
  "title",
  "description",
  "deadline",
  "status"
]);

type TUpdateTodoDto = v.InferInput<typeof updateTodoSchema>;

export {
  createTodoSchema,
  type TCreateTodoDto,
  updateTodoSchema,
  type TUpdateTodoDto
};
