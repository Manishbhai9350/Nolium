import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "../react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import WorkflowNode from "./workflow-node";
import NodeSelector from "./add-node-sheet";

export const InitialNode = memo((props: NodeProps) => {
  const [sheetOpen, setSheetOpen] = useState(false)
  return (
    <NodeSelector open={sheetOpen} onOpenChange={v => setSheetOpen(v)} >
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
      </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
