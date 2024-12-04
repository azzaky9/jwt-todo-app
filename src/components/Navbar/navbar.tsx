"use client";

import Link from "next/link";
import Profile from "./profile";
import { signout } from "~/app/user/action";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const client = useQueryClient();

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border border-1 mt-3 mx-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-lg font-semibold"
        >
          Todo App
        </Link>
        <Link
          href="/todo/new-todo"
          className="text-sm hover:underline"
        >
          Create Task
        </Link>

        <Link
          href="/user/profile"
          className="text-sm hover:underline"
        >
          Profile
        </Link>
        <button
          onClick={async () => {
            client.clear();
            await signout();
          }}
          className="text-sm bg-transparent p-0 hover:underline"
        >
          Sign Out
        </button>
      </div>
      <Profile />
    </nav>
  );
}
