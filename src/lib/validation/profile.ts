import * as v from "valibot";

const updateProfileSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(5, "Minimum 5 character's"))
});

const updatePasswordShema = v.object({
  password: v.pipe(v.string(), v.minLength(8, "Minimum 8 character's")),
  confirmationPassword: v.pipe(
    v.string(),
    v.minLength(8, "Minimum 8 character's")
  )
});

type TUpdatePasswordDto = v.InferInput<typeof updatePasswordShema>;
type TUpdateProfile = v.InferInput<typeof updateProfileSchema>;

export {
  type TUpdatePasswordDto,
  type TUpdateProfile,
  updatePasswordShema,
  updateProfileSchema
};
