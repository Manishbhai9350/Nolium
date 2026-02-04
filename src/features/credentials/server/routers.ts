import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "./constants";
import { CredentialTypes } from "@/generated/prisma/enums";
import { encrypt } from "@/lib/encryption";

export const credentialsRouters = createTRPCRouter({
  create: premiumProcedure
  .input(z.object({
    name: z.string().min(1,'Name is required'),
    type: z.enum(CredentialTypes),
    value: z.string().min(1,'Value is required')
  }))
  .mutation(async ({ ctx, input }) => {
    const { name, type, value, } = input;
    const credential = await prisma.credential.create({
      data: {
        name,
        userId: ctx.auth.user.id,
        type,
        value: encrypt(value)
      },
    });

    return credential;
  }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string().min(1,'Name is required'),
      type: z.enum(CredentialTypes),
      value: z.string().min(1,'Value is required')
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, name, type, value, } = input;
      return await prisma.credential.update({
        where: {
          userId: ctx.auth.user.id,
          id,
        },
        data: {
          name,
          type,
          value: encrypt(value)
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.credential.delete({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findUniqueOrThrow({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        }
      });

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
        prisma.credential.findMany({
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
        prisma.credential.count({
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
        totalPages,
      };
    }),
  getManyByType: protectedProcedure
  .input(z.object({
    type: z.enum(CredentialTypes)
  }))
  .query(async ({ ctx, input }) => {
    return prisma.credential.findMany({
      where: {
        userId: ctx.auth.user.id,
        type: input.type
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  })
});

