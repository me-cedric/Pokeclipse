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
      </QueryClientProvider>
    </trpc.Provider>
  );
}
