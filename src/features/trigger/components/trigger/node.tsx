import { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import TriggerDialog from "./dialog";

type TriggerNodeData = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: string;
};

type TriggerNodeType = Node<TriggerNodeData>;

export const TriggerNode = memo((props: NodeProps<TriggerNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodeData = props.data as TriggerNodeData;

  const status: NodeStatus = "initial";

  return (
    <>
      <TriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        status={status}
        title="Execute Workflow"
        id={props.id}
        icon={MousePointerIcon}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
      />
    </>
  );
});

TriggerNode.displayName = "TriggerNode";
