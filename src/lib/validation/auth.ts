import * as v from "valibot";

const RegisterSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.minLength(3, "min 3 character"),
    v.nonEmpty("required")
  ),
  email: v.pipe(
    v.string(),
    v.minLength(1),
    v.email("must be valid email"),
    v.trim()
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, "min 8 character"),
    v.nonEmpty("required"),
    v.trim()
  )
});

const LoginSchema = v.object({
  email: RegisterSchema.entries.email,
  password: v.pipe(v.string(), v.minLength(1, "Required"), v.trim())
});

type TRegisterDto = v.InferInput<typeof RegisterSchema>;
type TLoginDto = v.InferInput<typeof LoginSchema>;

export { RegisterSchema, type TRegisterDto, LoginSchema, type TLoginDto };
