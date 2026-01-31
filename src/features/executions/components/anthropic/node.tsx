import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import AnthropicDialog, { FormDataType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import { FetchAnthropicRealtimeToken } from "./action";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic-channel";


type AnthropicNodeData = {
  variableName?: string;
  // model?:GoogleGenerativeAIModel;
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo(
  (props: NodeProps<AnthropicNodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes, } = useReactFlow();

    const nodeData = props.data as AnthropicNodeData;

    const description = (nodeData.userPrompt || nodeData.systemPrompt)
      ? `gemini-2.0-flash: ${nodeData.userPrompt || nodeData.systemPrompt || ''}`
      : `Not Configured`;

    const { status } = useNodeStatus({
      nodeId: props.id,
      channel: ANTHROPIC_CHANNEL_NAME,
      topic: 'status',
      refreshToken: FetchAnthropicRealtimeToken
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
        <AnthropicDialog
          initial={{
            variableName: nodeData.variableName || "",
            // model: nodeData.model || AVAILABLE_MODELS[0],
            systemPrompt: nodeData.systemPrompt || "",
            userPrompt: nodeData.userPrompt || "",
          }}
          onSave={handleSave}
          open={DialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode
          {...props}
          status={status}
          title="Anthropic (Claude)"
          description={description}
          id={props.id}
          icon={'/logos/anthropic.svg'}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

AnthropicNode.displayName = "AnthropicNode";
