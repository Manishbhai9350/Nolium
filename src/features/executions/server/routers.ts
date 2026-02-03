import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "./constants";

export const exectuionsRouters = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.execution.findUniqueOrThrow({
        where: {
          workflow: { userId: ctx.auth.user.id },
          id: input.id,
        },
        include: {
          workflow:{
            select:{
              id:true,
              name:true
            }
          }
        }
      });
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(PAGINATION.page),
        pageSize: z
          .number()
          .min(PAGINATION.minPageSize)
          .max(PAGINATION.maxPageSize)
          .default(PAGINATION.pageSize),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [items, totalItems] = await Promise.all([
        prisma.execution.findMany({
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          where: {
            workflow: { userId: ctx.auth.user.id },
          },
          orderBy: {
            completedAt: "desc",
          },
          include: {
            workflow:{
              select:{
                id:true,
                name:true
              }
            }
          }
        }),
        prisma.execution.count({
          where: {
            workflow: { userId: ctx.auth.user.id },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalItems / input.pageSize);
      const hasNextPage = input.page < totalPages;
      const hasPrevPage = input.page > 1;

      return {
        items,
        hasNextPage,
        hasPrevPage,
        page: input.page,
        pageSize: input.pageSize,
        totalPages,
      };
    }),
});
