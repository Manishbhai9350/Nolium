import { InitialNode } from "@/components/custom/initial-node";
import { HTTPExecutionNode } from "@/features/executions/components/http-request/node";
import { GoogleFormTriggerNode } from "@/features/trigger/components/google-form-trigger/node";
import { TriggerNode } from "@/features/trigger/components/manual-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";


export const nodeComponent = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HTTPExecutionNode,
    [NodeType.MANUAL_TRIGGER]: TriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,

} as const satisfies NodeTypes

export type registeredNodeType = keyof typeof nodeComponent;