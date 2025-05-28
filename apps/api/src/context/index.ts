import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import jwt from "jsonwebtoken";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  let userId: string | null = null;

  const token =
    req.headers["authorization"] ?
      req.headers["authorization"].replace("Bearer ", "")
    : new URLSearchParams(req.url.split("?")[1]).get("token");

  if (token) {
    try {
      const decoded = jwt.decode(token) as { sub?: string } | null;
      userId = decoded?.sub ?? null;
    } catch {
      userId = null;
    }
  }
  return { req, res, userId };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
