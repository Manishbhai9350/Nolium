import { Connection, Node } from "@/generated/prisma/client";
import { NonRetriableError } from "inngest";
import toposort from "toposort";



export const TopologicalSortNodes = (nodes: Node[], connections:Connection[]) => {
    // Sorting The Nodes;

      const edges: [string, string][] = connections.map((edge) => [
        edge.fromNodeId,
        edge.toNodeId,
      ]);

      const connectionIds = new Set<string>();

      // If any node is not connected from any edge we make sure to include them also;
      for (const conn of connections) {
        connectionIds.add(conn.fromNodeId);
        connectionIds.add(conn.toNodeId);
      }

      for (const node of nodes) {
        if (!connectionIds.has(node.id)) {
          edges.push([node.id, node.id]);
        }
      }

      // Included Edges;

      let sortedNodeIds: string[];

      try {
        sortedNodeIds = toposort(edges);

        sortedNodeIds = [...new Set(sortedNodeIds)];
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.toLocaleLowerCase().includes("cyclic")
        ) {
          throw new NonRetriableError("Workflow contains cyclic nodes");
        }

        throw error;
      }

      const nodedMap = new Map(nodes.map((n) => [n.id, n]));
      const mapedNodes = sortedNodeIds
        .map((id) => nodedMap.get(id))
        .filter(Boolean);
      return mapedNodes;
}