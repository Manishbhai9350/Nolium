import { Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import StripeTriggerDialog from "./dialog";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger-channel";
import { useNodeStatus } from "@/features/executions/hooks/use-node";
import { FetchStripeTriggerRealtimeToken } from "./action";

type StripeTriggerNodeData = {
  nodeId: string;
}

type StripeTriggerNodeType = Node<StripeTriggerNodeData>;

export const StripeTriggerNode = memo(
  (props: NodeProps<StripeTriggerNodeType>) => {
    const [open, setOpen] = useState(false);

      const { status } = useNodeStatus({
        nodeId: props.id,
        channel: STRIPE_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: FetchStripeTriggerRealtimeToken,
      });

    return (
      <>
        <StripeTriggerDialog
          open={open}
          onOpenChange={setOpen}
          onSave={() => {}}
          nodeId={props.id}
        />
        <BaseTriggerNode
          {...props}
          status={status}
          title="Stripe Event"
          description="When stripe event captured"
          id={props.id}
          icon="/logos/stripe.svg"
          onSettings={() => setOpen(true)}
          onDoubleClick={() => setOpen(true)}
        />
      </>
    );
  },
);

StripeTriggerNode.displayName = "StripeTriggerNode";
