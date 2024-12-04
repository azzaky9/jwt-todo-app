import * as React from "react";
import SignupForm from "~/components/Forms/signup-form";

export default function Page() {
  return (
    <main className="w-full h-screen grid place-content-center bg-slate-100">
      <SignupForm />
    </main>
  );
}
