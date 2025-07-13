import { create } from "domain";
import z from "zod";
import { baseProcedure, protectedProcedure } from "../router/procedures";
import { SocketService } from "../services/SocketService";
import { gameRouter } from "./game";
import { t } from "./trpc";

export const appRouter = t.router({
  hello: baseProcedure.query(() => {
    return "Hello, world!";
  }),

  game: gameRouter,

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
      session: ctx.session,
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
