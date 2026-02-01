import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "./constants";
import type { Node, Edge } from "@xyflow/react";
import { NodeType } from "@/generated/prisma/enums";
import { SendWorkflowExecution } from "@/inngest/utils";

export const workflowRouters = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflow = await prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });

    return workflow;
  }),

  execute: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {

    const workflow = await prisma.workflow.findUniqueOrThrow({
      where: {
        id: input.id,
        userId: ctx.auth.user.id
      }
    })

    SendWorkflowExecution({ workflowId:workflow.id })
    
    return workflow;
  }),

  save: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }) || {},
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workflowId, nodes, edges } = input;
      // Deleting Existing Workflow Nodes, Edges
      await prisma.workflow.findFirstOrThrow({
        where: {
          id: workflowId,
          userId: ctx.auth.user.id,
        },
      });

      return await prisma.$transaction(async (trscn) => {
        // Deleting Existing Nodes that will also delete Connections (Edges) with Cascade
        await trscn.node.deleteMany({
          where: { workflowId },
        });

        // Creating new Nodes
        await trscn.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
            workflowId,
          })),
        });

        // Creating new Edges
        await trscn.connection.createMany({
          data: edges.map((edge) => ({
            workflowId,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        return await trscn.workflow.update({
          where: {
            id: workflowId,
            userId: ctx.auth.user.id,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      });
    }),

  updateName: protectedProcedure
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
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
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
        totalPages,
      };
    }),
});
