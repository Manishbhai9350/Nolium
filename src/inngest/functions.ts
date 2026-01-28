import prisma from "@/lib/db";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import topoSort from "toposort";
import { TopologicalSortNodes } from "@/lib/nodes";
import { getExecutor } from "@/config/executors";

export const executeWorkflow = inngest.createFunction(
  { id: "execute.workflow" },
  { event: "workflow/execute.workflow" },
  async ({ event, step }) => {
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

    let context = event.data.initialData|| {};

    // Execution
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);

      context = await executor({
        context,
        data: node.data as Record<string,unknown>,
        nodeId: node.id,
        step
      })
    }

    return { 
      workflowId:event.data.workflowId,
      data:context
     };
  },
);
