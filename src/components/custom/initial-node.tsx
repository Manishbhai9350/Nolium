import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { PlaceholderNode } from "../react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import WorkflowNode from "./workflow-node";

export const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode 
      showToolbar
      title="Add Node"
      description="Click to add your first node"  
    >
      <PlaceholderNode {...props}>
        <div className="cursor-pointer flex justify-center items-center">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

InitialNode.displayName = "InitialNode";
