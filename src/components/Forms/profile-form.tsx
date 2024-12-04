"use client";

import { useForm } from "@tanstack/react-form";

import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { FormEvent, useState } from "react";
import { TUpdateProfile, updateProfileSchema } from "~/lib/validation/profile";

import Input from "./input";
import HelperInput from "../Indicator/helper-input";
import { UserResponse } from "~/types";
import { useErrorTransform } from "./use-transform";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  initialData: UserResponse;
};

const updateProfile = async (data: TUpdateProfile) => {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  const req = await fetch(url + "/api/user/profile", {
    credentials: "include",
    body: JSON.stringify(data),
    method: "PUT"
  });
  const res = await req.json();

  return res;
};

export default function ProfileForm({ initialData }: Props) {
  const globalQuery = useQueryClient();
  const router = useRouter();
  const { getInputStatus } = useErrorTransform();

  const [firstAttempt, setFirstAttempt] = useState(true);

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      router.refresh();
      globalQuery.invalidateQueries({ queryKey: "user-profile" });
    },
    onError: () => toast.error("Profile updated")
  });

  const form = useForm({
    defaultValues: {
      fullName: initialData.name ?? ""
    } as TUpdateProfile,
    validatorAdapter: valibotValidator(),
    validators: {
      onSubmit: updateProfileSchema,
      onChange: updateProfileSchema
    },
    onSubmit: async ({ value }) => await mutateAsync(value)
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setFirstAttempt(false);

    form.handleSubmit();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <form.Field name="fullName">
            {({ name, handleBlur, handleChange, state }) => {
              const { invalid, messageOnChange, messageOnSubmit } =
                getInputStatus(state);

              return (
                <>
                  <Input
                    label="Full Name"
                    id="title"
                    type="text"
                    disabled={isPending}
                    invalid={invalid}
                    name={name}
                    value={state.value}
                    onChange={(e) => {
                      setFirstAttempt(false);
                      handleChange(e.currentTarget.value);
                    }}
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
        <div className="mt-2 grid place-content-end">
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <button
                type="submit"
                className="btn btn-secondary disabled:opacity-50"
                disabled={
                  isSubmitting || !canSubmit || firstAttempt || isPending
                }
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
