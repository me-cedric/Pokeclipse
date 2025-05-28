import { TRPCError } from "@trpc/server";
import { t } from "./trpc";

const procedureLogger = t.middleware(async ({ ctx, next, path, type }) => {
  console.log(`[${ctx.userId ?? "guest"}] - ${type} ${path}`);

  return next({ ctx });
});

const isAuthorized = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const baseProcedure = t.procedure.use(procedureLogger);

export const protectedProcedure = baseProcedure.use(isAuthorized);
