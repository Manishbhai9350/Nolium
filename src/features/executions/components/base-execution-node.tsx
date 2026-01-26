import React, { memo } from "react";
import type { LucideIcon } from "lucide-react";
import  {  type NodeProps, Position } from "@xyflow/react";
import Image from "next/image";
import WorkflowNode from "@/components/custom/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseExecutionNodeProps extends NodeProps {
  title: string;
  description?: string;
  icon: LucideIcon | string;
  children?: React.ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    title,
    description,
    onSettings,
    children,
    onDoubleClick,
    icon: Icon,
  }: BaseExecutionNodeProps) => {
    return (
      <WorkflowNode
        title={title}
        description={description}
        onDelete={() => {}}
        onSettings={onSettings}
        showToolbar
      >
        <BaseNode onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon == "string" ? (
              <Image src={Icon} alt={title} height={16} width={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            { children }
            
          </BaseNodeContent>
          <BaseHandle id="source-1" type="source" position={Position.Right} />
          <BaseHandle id="target-1" type="target" position={Position.Left} />
        </BaseNode>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";
