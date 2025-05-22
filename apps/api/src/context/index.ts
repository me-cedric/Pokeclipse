import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  return { req, res, prisma };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
