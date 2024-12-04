"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "./navbar";

export default function NavigationLayout({
  children
}: React.PropsWithChildren) {
  const pathName = usePathname();

  const isAuthPage = pathName === "/signin" || pathName === "/signup";

  if (!isAuthPage) {
    return (
      <main className="bg-slate-100 grid place-content-center">
        <div className="w-[1000px] h-screen ">
          <Navbar />
          <div className="px-10 mt-4">{children}</div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
