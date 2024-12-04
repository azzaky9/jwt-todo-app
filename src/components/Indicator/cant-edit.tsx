import Link from "next/link";

export default function CantEdit() {
  return (
    <p className="text-xs mt-0.5 text-gray-600">
      Cannot edit completed task,{" "}
      <Link
        className="text-blue-500 underline"
        href={"/"}
      >
        Go back
      </Link>
    </p>
  );
}
