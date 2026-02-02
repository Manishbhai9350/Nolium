import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { FormDataType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import DiscordDialog from "./dialog";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord-channel";
import { FetchDiscordRealtimeToken } from "./action";


type DiscordNodeData = {
  variableName?: string;
  username?: string;
  content?: string;
  webhookUrl?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo(
  (props: NodeProps<DiscordNodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes, } = useReactFlow();

    const nodeData = props.data as DiscordNodeData;

    const description = (nodeData.webhookUrl)
      ? `${nodeData.username || 'Discord'}: ${nodeData.webhookUrl}`
      : `Not Configured`;

    const { status } = useNodeStatus({
      nodeId: props.id,
      channel: DISCORD_CHANNEL_NAME,
      topic: 'status',
      refreshToken: FetchDiscordRealtimeToken
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
        <DiscordDialog
          initial={{
            variableName: nodeData.variableName || "",
            content: nodeData.content || "",
            webhookUrl: nodeData.webhookUrl || "",
            username: nodeData.username || ""
          }}
          onSave={handleSave}
          open={DialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode
          {...props}
          status={status}
          title="Discord"
          description={description}
          id={props.id}
          icon={'/logos/discord.svg'}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

DiscordNode.displayName = "DiscordNode";
