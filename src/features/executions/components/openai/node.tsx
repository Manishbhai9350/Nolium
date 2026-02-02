import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { FormDataType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import { FetchOpenaiRealtimeToken } from "./action";
import { AVAILABLE_MODELS, type GoogleGenerativeAIModel } from "./utils";
import OpenAIDialog from "./dialog";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai-channel";


type OpenAINodeData = {
  variableName?: string;
  model?:GoogleGenerativeAIModel;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo(
  (props: NodeProps<OpenAINodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes, } = useReactFlow();

    const nodeData = props.data as OpenAINodeData;

    const description = (nodeData.userPrompt || nodeData.systemPrompt || nodeData.model)
      ? `OpenAI-2.0-flash: ${nodeData.userPrompt || nodeData.systemPrompt || ''}`
      : `Not Configured`;

    const { status } = useNodeStatus({
      nodeId: props.id,
      channel: OPENAI_CHANNEL_NAME,
      topic: 'status',
      refreshToken: FetchOpenaiRealtimeToken
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
        <OpenAIDialog
          key={nodeData.model}
          initial={{
            variableName: nodeData.variableName || "",
            // model: nodeData.model || AVAILABLE_MODELS[0],
            systemPrompt: nodeData.systemPrompt || "",
            userPrompt: nodeData.userPrompt || "",
            credentialId: nodeData.credentialId || ""
          }}
          onSave={handleSave}
          open={DialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode
          {...props}
          status={status}
          title="OpenAI"
          description={description}
          id={props.id}
          icon={'/logos/openai.svg'}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

OpenAINode.displayName = "OpenAINode";
