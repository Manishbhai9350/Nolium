import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { FormDataType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import SlackDialog from "./dialog";
import { FetchSlackRealtimeToken } from "./action";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack-channel";


type SlackNodeData = {
  variableName?: string;
  content?: string;
  webhookUrl?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo(
  (props: NodeProps<SlackNodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes, } = useReactFlow();

    const nodeData = props.data as SlackNodeData;

    const description = (nodeData.webhookUrl)
      ? `Slack: ${nodeData.webhookUrl}`
      : `Not Configured`;

    const { status } = useNodeStatus({
      nodeId: props.id,
      channel: SLACK_CHANNEL_NAME,
      topic: 'status',
      refreshToken: FetchSlackRealtimeToken
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
        <SlackDialog
          initial={{
            variableName: nodeData.variableName || "",
            content: nodeData.content || "",
            webhookUrl: nodeData.webhookUrl || "",
          }}
          onSave={handleSave}
          open={DialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode
          {...props}
          status={status}
          title="Slack"
          description={description}
          id={props.id}
          icon={'/logos/slack.svg'}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

SlackNode.displayName = "SlackNode";
