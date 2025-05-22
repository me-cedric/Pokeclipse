import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const appRouter = t.router({});

// export type definition of API
export type AppRouter = typeof appRouter;
