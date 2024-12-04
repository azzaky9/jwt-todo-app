"use client";

import Link from "next/link";
import Input from "./input";
import PasswordInput from "./password-input";
import { useFormStatus } from "react-dom";
import { register } from "~/app/user/action";
import { useActionState, useState } from "react";

const initial = {} as { [key: string]: string };

export default function SignupForm() {
  const [errors, formAction] = useActionState(register, initial);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const status = useFormStatus();

  const isLoading = status.pending;
  const isNotEqual =
    Boolean(confirmPassword) && confirmPassword !== userData.password;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setUserData({ ...userData, [name]: value });
  };

  const create = () => {
    const formData = new FormData();

    const { email, fullName, password } = userData;

    formData.set("fullName", fullName);
    formData.set("email", email);
    formData.set("password", password);

    formAction(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-[520px] ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form
          className="space-y-4"
          action={() => create()}
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              type="fullName"
              required
              onChange={handleChange}
              value={userData.fullName}
              disabled={isLoading}
            />
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
              value={userData.email}
              disabled={isLoading}
            />
            <PasswordInput
              label="Password"
              id="password"
              name="password"
              required
              invalid={isNotEqual}
              onChange={handleChange}
              value={userData.password}
              disabled={isLoading}
            />
            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              required
              invalid={isNotEqual}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              disabled={isLoading || !userData.password}
            />
          </div>

          <div>
            <ul>
              {Object.entries({ ...errors }).map(([key, value]) => (
                <li
                  key={key}
                  className="text-red-500 text-sm capitalize"
                >
                  {key} - {value}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              Sign Up
            </button>
            <span className="text-center text-slate-500 text-sm">
              Already have an account ?
            </span>
            <Link href="/signin">
              <button
                className="btn-secondary w-full"
                disabled={isLoading}
              >
                Sign In
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
