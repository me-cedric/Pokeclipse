import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { createContext } from "./context";
import { appRouter } from "./router";

const app = fastify({ maxParamLength: 5000 });

app.register(cors, { origin: "*" });

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }: { path?: string; error: Error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  },
});

(async () => {
  try {
    await app.listen({ port: 5000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
