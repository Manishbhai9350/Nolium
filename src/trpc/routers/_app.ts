import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import prisma from "@/lib/db";
export const appRouter = createTRPCRouter({
  neonStart: baseProcedure.query( async () => {
    return await prisma.user.findMany();
  }),
  getMeows: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
