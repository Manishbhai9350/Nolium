import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import HttpRequestDialog, { FormDataType } from "./dialog";

type HTTPExecutionNodeData = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: string;
};

type HTTPExecutionNodeType = Node<HTTPExecutionNodeData>;

export const HTTPExecutionNode = memo(
  (props: NodeProps<HTTPExecutionNodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeData = props.data as HTTPExecutionNodeData;

    const description = nodeData.method
      ? `${nodeData.method}: ${nodeData.endpoint}`
      : `Not Configured`;

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
          initial={{
            endpoint: nodeData.endpoint || "",
            method: nodeData.method || "GET",
            body: nodeData.body || "",
          }}
          onSave={handleSave}
          open={DialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode
          status="initial"
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
