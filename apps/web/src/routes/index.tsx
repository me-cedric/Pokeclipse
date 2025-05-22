import Button from "@/components/button/Button";
import Frame from "@/components/frame/Frame";
import { trpc } from "@/hooks/trpc";
import { createFileRoute } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: "http://localhost:5000/trpc",
          }),
        ],
      }),
    []
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="text-center">pokecplise</div>
        <Button color={"#a60d0d"} reverseFont={true}>
          CAPACITES
        </Button>
        <Button color={"#d2a828"} reverseFont={true}>
          OBJETS
        </Button>
        <Button color={"#5da93c"} reverseFont={true}>
          ???
        </Button>
        <Button color={"#515aa8"} reverseFont={true}>
          ???
        </Button>
        <Frame>REPONSE</Frame>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
