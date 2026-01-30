import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import HttpRequestDialog, { FormDataType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import { FetchHttpRealtimeToken } from "./action";
import { HTTP_CHANNEL_NAME } from "@/inngest/channels/http-channel";
import { useSaveWorkflow } from "@/features/workflows/hooks/useWorkflow";

type HTTPExecutionNodeData = {
  variableName?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: string;
};

type HTTPExecutionNodeType = Node<HTTPExecutionNodeData>;

export const HTTPExecutionNode = memo(
  (props: NodeProps<HTTPExecutionNodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes, } = useReactFlow();

    const nodeData = props.data as HTTPExecutionNodeData;

    const description = nodeData.method
      ? `${nodeData.method}: ${nodeData.endpoint}`
      : `Not Configured`;

    const { status } = useNodeStatus({
      nodeId: props.id,
      channel: HTTP_CHANNEL_NAME,
      topic: 'status',
      refreshToken: FetchHttpRealtimeToken
    })

    const handleSave = (values: FormDataType) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id == props.id) {
            return {
              ...node,
              data: values,
            };
          }

          return node;
        }),
      );
    };


    return (
      <>
        <HttpRequestDialog
          key={nodeData.endpoint}
          initial={{
            variableName: nodeData.variableName || "",
            endpoint: nodeData.endpoint || "",
            method: nodeData.method || "GET",
            body: nodeData.body || "",
          }}
          onSave={handleSave}
          open={DialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode
          status={status}
          {...props}
          title="HTTP Request"
          description={description}
          id={props.id}
          icon={GlobeIcon}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

HTTPExecutionNode.displayName = "HTTPExecutionNode";
