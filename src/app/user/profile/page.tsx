import { cookies } from "next/headers";
import CardProfile from "~/components/Profile/card-profile";
import CardResetPassword from "~/components/Profile/card-reset-password";
import { ServerResponse, UserResponse } from "~/types";

export default async function Page() {
  const cookie = await cookies();
  const req = await fetch(process.env.API_URL + `/user/profile`, {
    credentials: "include",
    headers: {
      Cookie: cookie.toString()
    }
  });
  const res = (await req.json()) as ServerResponse<UserResponse>;

  return (
    <div className="px-1 grid grid-cols-2 gap-4">
      <CardProfile profileData={res.data ?? null} />
      <CardResetPassword />
    </div>
  );
}
