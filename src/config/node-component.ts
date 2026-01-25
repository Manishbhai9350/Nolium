import { InitialNode } from "@/components/custom/initial-node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";


export const nodeComponent = {
    [NodeType.INITIAL]: InitialNode
} as const satisfies NodeTypes

export type registeredNodeType = keyof typeof nodeComponent;