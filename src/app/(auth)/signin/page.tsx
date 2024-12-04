import * as React from "react";
import SignInForm from "~/components/Forms/signin-form";

export default function Page() {
  return (
    <main className="w-full h-screen bg-slate-100 grid place-content-center">
      <SignInForm />
    </main>
  );
}
