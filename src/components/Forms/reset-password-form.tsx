"use client";

import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import {
  TUpdatePasswordDto,
  updatePasswordShema
} from "~/lib/validation/profile";

import { useErrorTransform } from "./use-transform";
import HelperInput from "~/components/Indicator/helper-input";
import PasswordInput from "./password-input";
import { ServerResponse } from "~/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const resetPassword = async (data: TUpdatePasswordDto) => {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  const req = await fetch(url + "/api/user/profile/reset-password", {
    credentials: "include",
    body: JSON.stringify(data),
    method: "POST"
  });
  const res: ServerResponse = await req.json();
  return res;
};

export default function ResetPasswordForm() {
  const { getInputStatus } = useErrorTransform();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-password"],
    mutationFn: resetPassword
  });

  const form = useForm({
    defaultValues: {
      password: "",
      confirmationPassword: ""
    } as TUpdatePasswordDto,
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: updatePasswordShema,
      onSubmit: updatePasswordShema
    },
    onSubmit: async ({ value, formApi }) => {
      const response = await mutateAsync(value);
      if (response && response.statusCode === 200) {
        toast.success("Password updated");
        formApi.reset();
      } else {
        toast.error("Failed to update, your old password not match");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    form.handleSubmit();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div>
            <form.Field name="password">
              {({ name, handleBlur, handleChange, state }) => {
                const { invalid, messageOnChange, messageOnSubmit } =
                  getInputStatus(state);

                return (
                  <>
                    <PasswordInput
                      label="Old Password"
                      id="old-password"
                      disabled={isPending}
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
            <form.Field name="confirmationPassword">
              {({ name, handleBlur, handleChange, state }) => {
                const { invalid, messageOnChange, messageOnSubmit } =
                  getInputStatus(state);

                return (
                  <>
                    <PasswordInput
                      label="New Password"
                      id="password"
                      disabled={isPending}
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
        <div className="mt-3 grid place-content-end">
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <button
                type="submit"
                className="btn btn-secondary disabled:opacity-50"
                disabled={isSubmitting || !canSubmit || isPending}
              >
                Update
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
