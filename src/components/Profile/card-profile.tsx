import ProfileForm from "~/components/Forms/profile-form";
import { UserResponse } from "~/types";

type Props = {
  profileData: UserResponse | null;
};

export default function CardProfile({ profileData }: Props) {
  return (
    <div className="h-fit w-full m-3 px-10 py-8 bg-white rounded-md border border-1">
      {profileData ? (
        <ProfileForm initialData={profileData} />
      ) : (
        <p className="text-sm">unauthorized</p>
      )}
    </div>
  );
}
