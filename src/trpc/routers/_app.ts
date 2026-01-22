import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation( async () => {

    await inngest.send({
      name:'generate/ai'
    })

    return {
      model: "AI Test's started "
    }

  }),
  getWorkflows: protectedProcedure.query(async () => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {

    return prisma.workflow.create({
      data: {
        name: "Meow-Workflow",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
