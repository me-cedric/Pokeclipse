import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import prisma from "../db";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  return { req, res, prisma };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
