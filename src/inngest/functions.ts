import prisma from "@/lib/db";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import { TopologicalSortNodes } from "@/lib/nodes";
import { getExecutor } from "@/config/executors";
import { ManualTriggerChannel } from '@/inngest/channels/manual-trigger-channel';
import { HttpChannel } from '@/inngest/channels/http-channel';
import { GoogleFormTriggerChannel } from "./channels/googl-form-trigger-channel";
import { AnthropicChannel } from "./channels/anthropic-channel";
import { GeminiChannel } from "./channels/gemini-channel";
import { OpenAiChannel } from "./channels/openai-channel";
import { discordChannel } from "./channels/discord-channel";
import { slackChannel } from "./channels/slack-channel";
import { ExecutionStatus } from "@/generated/prisma/enums";

export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute.workflow",
    retries: 0, /* TODO: Remove In Production */
    async onFailure({ event }) {
      // Updating Execution 
      console.log({event})
    await prisma.execution.update({
      where: {
        inngestEventId: event.data.event.id,
      },
      data: {
        status: ExecutionStatus.FAILED,
        error: event.data.error.message,
        errorStack: event.data.error.stack
      }
    })
    }
   },
  { 
    event: "workflow/execute.workflow",
    channels: [
      HttpChannel(),
      ManualTriggerChannel(),
      GoogleFormTriggerChannel(),
      AnthropicChannel(),
      GeminiChannel(),
      OpenAiChannel(),
      discordChannel(),
      slackChannel()
    ]
   },
  async ({ event, step, publish }) => {
    const createdExecution = await step.run('creating-execution', async () => {
      return prisma.execution.create({
        data: {
          inngestEventId:event.id!,
          status: ExecutionStatus.RUNNING,
          workflowId: event.data.workflowId
        }
      })
    })

    const sortedNodes = await step.run("prepare-nodes", async () => {
      const workflow = await prisma.workflow.findUnique({
        where: {
          id: event.data.workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      if (!workflow) {
        throw new NonRetriableError("Workflow Not Found!");
      }

      const { nodes, connections } = workflow;

      return TopologicalSortNodes(nodes, connections);
    });

    const userId = await step.run("fetch-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: event.data.workflowId
        },
        select: {
          userId:true
        }
      })

      return workflow.userId;
    })

    let context = event.data.initialData|| {};

    // Execution
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);

      context = await executor({
        context,
        data: node.data as Record<string,unknown>,
        nodeId: node.id,
        userId,
        step,
        publish
      })
    }

    // Updating Execution 
    await prisma.execution.update({
      where: {
        inngestEventId: event.id!,
        workflowId: event.data.workflowId
      },
      data: {
        completedAt: new Date(),
        status: ExecutionStatus.SUCCESS,
        output: context
      }
    })

    return { 
      workflowId:event.data.workflowId,
      data:context
     };
  },
);
