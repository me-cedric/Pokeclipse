// Import the generated route tree
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "../../api/src/router";
import { Spinner } from "@nextui-org/react";

export const queryClient = new QueryClient();

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        url: "http://localhost:5000/trpc",
      }),
    ],
  }),
  queryClient,
});

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    trpc,
    queryClient,
  },
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  Wrap: function WrapComponent({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
