import { baseProcedure, protectedProcedure } from "../router/procedures";
import { SocketService } from "../services/SocketService";
import { t } from "./trpc";

export const appRouter = t.router({
  hello: baseProcedure.query(() => {
    return "Hello, world!";
  }),

  activeGames: baseProcedure.subscription(async function* (opts) {
    yield [{ id: "1" }];

    for await (const data of SocketService.subscribe<{ id: string }[]>("yolo", {
      signal: opts.signal,
    })) {
      yield data;
    }
  }),

  protected: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.userId,
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
