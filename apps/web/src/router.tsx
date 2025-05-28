// Import the generated route tree
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCProvider } from "./utils/trpc";
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  TRPCClientError,
  wsLink,
} from "@trpc/client";
import superjson from "superjson";

import { Spinner } from "@nextui-org/react";
import type { AppRouter } from "../../api/src/router";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof TRPCClientError) {
          // Don't retry if the error is due to unauthorized access
          if (error.data?.code === "UNAUTHORIZED") {
            return false;
          }
        }

        return failureCount < 3;
      },
    },
  },
});

function getAuthToken() {
  return localStorage.getItem("pokeclipse-token") ?? "guest";
}

const wsClient = createWSClient({
  url: `ws://localhost:5000/ws?token=${getAuthToken()}`,
});

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({ client: wsClient, transformer: superjson }),
      false: httpBatchLink({
        url: "http://localhost:5000/trpc",
        async headers() {
          return {
            Authorization: `Bearer ${getAuthToken()}`,
          };
        },
        transformer: superjson,
      }),
    }),
  ],
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
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpc} queryClient={queryClient}>
          {children}
        </TRPCProvider>
      </QueryClientProvider>
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
