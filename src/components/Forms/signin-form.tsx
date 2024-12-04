"use client";

import Link from "next/link";
import Input from "./input";
import PasswordInput from "./password-input";
import { InitialErrorResponse, signin } from "~/app/user/action";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

const initial = {} as InitialErrorResponse;

export default function SignInForm() {
  const [error, formAction] = useActionState(signin, initial);
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center justify-center min-h-screen w-[360px] ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form
          className="space-y-4"
          action={formAction}
        >
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            required
            disabled={pending}
          />
          <PasswordInput
            label="Password"
            id="password"
            name="password"
            type="password"
            required
            disabled={pending}
          />

          <ul>
            {Object.entries(error).map(([key, value]) => (
              <li
                key={key}
                className="text-red-500 text-sm"
              >
                {key} - {value}
              </li>
            ))}
          </ul>

          <div className="w-full flex flex-col gap-2">
            <button
              className="btn-primary"
              type="submit"
            >
              Sign In
            </button>
            <span className="text-center text-slate-500 text-sm">or</span>
            <Link href="/signup">
              <button className="btn-secondary w-full">Sign Up</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
