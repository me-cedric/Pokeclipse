import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { createContext } from "./context";
import { appRouter } from "./router";
import { auth } from "src/utils/auth";

const app = fastify({ maxParamLength: 5000 });
app.register(ws);
app.register(cors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

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

app.register(fastifyTRPCPlugin, {
  prefix: "/ws",
  useWSS: true,
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }: { path?: string; error: Error }) {
      // report to error monitoring
      console.error(`Error in tRPC WS handler on path '${path}':`, error);
    },
  },
  keepAlive: {
    enabled: true,
    pingMs: 30000,
    pongWaitMs: 5000,
  },
});

// Better auth
app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });

      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      // Process authentication request
      const response = await auth.handler(req);

      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error("Authentication Error:", error);
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
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
