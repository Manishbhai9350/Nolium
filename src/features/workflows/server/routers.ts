import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "./constants";

export const workflowRouters = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflow = await prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    });

    return workflow;
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedWorkflow = await prisma.workflow.update({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });

      return updatedWorkflow;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const removedWorkflow = await prisma.workflow.delete({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });

      return removedWorkflow;
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUnique({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });

      return workflow;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        search: z.string().default(""),
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
        prisma.workflow.findMany({
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: input.search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: input.search,
            },
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
        totalPages
      };
    }),
});
