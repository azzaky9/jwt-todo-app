import { Todo } from "~/db/interface";

type Props = {
  status: Todo["status"];
};

export default function TodoStatus(props: Props) {
  const chipClass =
    props.status === "complete"
      ? "border-green-500 text-green-500"
      : "border-blue-500 text-blue-500";

  return (
    <div>
      <span
        className={`px-3 py-1 text-xs rounded-full capitalize border ${chipClass}`}
      >
        {props.status === "complete" ? "complete" : "scheduled"}
      </span>
    </div>
  );
}
