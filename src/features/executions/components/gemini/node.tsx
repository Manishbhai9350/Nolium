import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { FormDataType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import { FetchGeminiRealtimeToken } from "./action";
import { AVAILABLE_MODELS, type GoogleGenerativeAIModel } from "./utils";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini-channel";
import GeminiDialog from "./dialog";


type GeminiNodeData = {
  variableName?: string;
  model?:GoogleGenerativeAIModel;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo(
  (props: NodeProps<GeminiNodeType>) => {
    const [DialogOpen, setDialogOpen] = useState(false);

    const { setNodes, } = useReactFlow();

    const nodeData = props.data as GeminiNodeData;

    const description = (nodeData.userPrompt || nodeData.systemPrompt || nodeData.model)
      ? `gemini-2.0-flash: ${nodeData.userPrompt || nodeData.systemPrompt || ''}`
      : `Not Configured`;

    const { status } = useNodeStatus({
      nodeId: props.id,
      channel: GEMINI_CHANNEL_NAME,
      topic: 'status',
      refreshToken: FetchGeminiRealtimeToken
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
        <GeminiDialog
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
          title="Gemini"
          description={description}
          id={props.id}
          icon={'/logos/gemini.svg'}
          onSettings={() => setDialogOpen(true)}
          onDoubleClick={() => setDialogOpen(true)}
        />
      </>
    );
  },
);

GeminiNode.displayName = "GeminiNode";
