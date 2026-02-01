import { workflowRouters } from "@/features/workflows/server/routers";
import { createTRPCContext, createTRPCRouter } from "../init";
import { credentialsRouters } from "@/features/credentials/server/routers";

export const appRouter = createTRPCRouter({
 workflows: workflowRouters,
 credentials: credentialsRouters
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const caller = appRouter.createCaller(createTRPCContext)
