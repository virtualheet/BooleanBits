// server/api/root.ts
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { portfolioRouter } from "@/server/api/routers/portfolio";

export const appRouter = createTRPCRouter({
  user: userRouter,
  portfolio: portfolioRouter,
});

export type AppRouter = typeof appRouter;