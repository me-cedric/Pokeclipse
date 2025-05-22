import type { AppRouter } from "@pokeclipse/api";
import { createReactQueryHooks } from "@trpc/react";

export const trpc = createReactQueryHooks<AppRouter>();
