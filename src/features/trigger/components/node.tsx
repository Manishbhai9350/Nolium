import { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";


type TriggerNodeData = {
    method?: "GET" |  "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint?: string;
    body?: string;
};

type TriggerNodeType = Node<TriggerNodeData>;



export const TriggerNode = memo((props:NodeProps<TriggerNodeType>) => {

    const nodeData = props.data as TriggerNodeData;
    return (
        <BaseTriggerNode 
            {...props}
            title="Execute Workflow"
            id={props.id}
            icon={MousePointerIcon}
            onSettings={() => {}}
            onDoubleClick={() => {}}
        />
    )
})

TriggerNode.displayName = "TriggerNode"