import { workflowRouters } from "@/features/workflows/server/routers";
import { createTRPCContext, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
 workflows: workflowRouters
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const caller = appRouter.createCaller(createTRPCContext)
