import { trpc } from "@/router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data } = useQuery(trpc.hello.queryOptions());

  return (
    <>
      <div>{data}</div>
    </>
  );
}
