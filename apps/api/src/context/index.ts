import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { auth } from "../utils/auth";

export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) headers.append(key, value.toString());
  });

  const session = await auth.api.getSession({
    headers,
  });

  return { req, res, session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
