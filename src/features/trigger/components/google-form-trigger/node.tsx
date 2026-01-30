import { Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import GoogleFormTriggerDialog from "./dialog";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/googl-form-trigger-channel";
import { useNodeStatus } from "@/features/executions/hooks/use-node";
import { FetchGoogleFormTriggerRealtimeToken } from "./action";

type GoogleFormTriggerNodeData = {
  nodeId: string;
}

type GoogleFormTriggerNodeType = Node<GoogleFormTriggerNodeData>;

export const GoogleFormTriggerNode = memo(
  (props: NodeProps<GoogleFormTriggerNodeType>) => {
    const [open, setOpen] = useState(false);

      const { status } = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: FetchGoogleFormTriggerRealtimeToken,
      });

    return (
      <>
        <GoogleFormTriggerDialog
          open={open}
          onOpenChange={setOpen}
          onSave={() => {}}
          nodeId={props.id}
        />
        <BaseTriggerNode
          {...props}
          status={status}
          title="Google Form"
          description="When form is submitted"
          id={props.id}
          icon="/logos/googleform.svg"
          onSettings={() => setOpen(true)}
          onDoubleClick={() => setOpen(true)}
        />
      </>
    );
  },
);

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
