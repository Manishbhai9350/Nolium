import { BaseExecutionNode } from "../base-execution-node";
import { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo } from "react";


type HTTPExecutionNodeData = {
    method?: "GET" |  "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint?: string;
    body?: string;
};

type HTTPExecutionNodeType = Node<HTTPExecutionNodeData>;



export const HTTPExecutionNode = memo((props:NodeProps<HTTPExecutionNodeType>) => {

    const nodeData = props.data as HTTPExecutionNodeData;

    const description = nodeData.method ? `${nodeData.method}: ${nodeData.endpoint}` : `Not Configured`;

    return (
        <BaseExecutionNode 
            {...props}
            title="HTTP Request"
            description={description}
            id={props.id}
            icon={GlobeIcon}
            onSettings={() => {}}
            onDoubleClick={() => {}}
        />
    )
})

HTTPExecutionNode.displayName = "HTTPExecutionNode"