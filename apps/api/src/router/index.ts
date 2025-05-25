import { initTRPC } from "@trpc/server";
import { EventEmitter, on } from "stream";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

// TODO: Typesafe reusable global event emitter
const ee = new EventEmitter();

export const appRouter = t.router({
  hello: t.procedure.query(() => {
    return "Hello, world!";
  }),

  activeGames: t.procedure.subscription(async function* (opts) {
    yield [{ id: "1" }];

    for await (const [data] of on(ee, "activeGames", {
      signal: opts.signal,
    })) {
      yield data as { id: string }[];
    }
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
