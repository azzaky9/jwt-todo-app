import { Suspense } from "react";
import Loader from "~/components/Indicator/loader";
import Todos from "~/components/Todo/todos";

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <Todos />
    </Suspense>
  );
}
