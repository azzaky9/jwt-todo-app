"use client";

import { useQuery } from "@tanstack/react-query";
import { ServerResponse, UserResponse } from "~/types";
import Loader from "~/components/Indicator/loader";

async function getUserProfile() {
  const url = process.env.NEXT_PUBLIC_APP_URL;

  const req = await fetch(url + "/api/user/profile", {
    method: "GET",
    credentials: "include"
  });

  if (req.ok) {
    const result: ServerResponse<UserResponse> = await req.json();
    return result;
  }

  return null;
}

export default function Profile() {
  const {
    data: response,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => getUserProfile()
  });

  if (isLoading) return <Loader />;

  if (isError) return <div>Failed to get User Info</div>;

  return (
    <div className="flex gap-3">
      <button className="flex items-center space-x-2 text-sm">
        <img
          src="https://avatars.githubusercontent.com/u/29647600?v=4"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </button>
      <div className="flex flex-col justify-end">
        <h1 className="capitalize text-sm text-slate-700">
          {response?.data.name ?? ""}
        </h1>
        <span className="text-xs text-slate-700">
          {response?.data.email ?? ""}
        </span>
      </div>
    </div>
  );
}
