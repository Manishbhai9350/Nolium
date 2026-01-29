import { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import TriggerDialog from "./dialog";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigget-channel";
import { useNodeStatus } from "@/features/executions/hooks/use-node";
import { FetchManualTriggerRealtimeToken } from "./action";

type TriggerNodeData = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: string;
};

type TriggerNodeType = Node<TriggerNodeData>;

export const TriggerNode = memo((props: NodeProps<TriggerNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodeData = props.data as TriggerNodeData;

  const { status } = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: FetchManualTriggerRealtimeToken,
  });

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
