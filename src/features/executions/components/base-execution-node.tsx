import React, { memo } from "react";
import type { LucideIcon } from "lucide-react";
import  {  type NodeProps, Position, useReactFlow } from "@xyflow/react";
import Image from "next/image";
import WorkflowNode from "@/components/custom/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  id:string,
  status?: NodeStatus;
  title: string;
  description?: string;
  icon: LucideIcon | string;
  children?: React.ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    status = 'initial',
    title,
    description,
    onSettings,
    children,
    onDoubleClick,
    icon: Icon,
  }: BaseExecutionNodeProps) => {

    const { setNodes, setEdges } = useReactFlow()
    
        const handleDelete = () => {
          setNodes(nodes => {
            const updatedNodes = nodes.filter(node => !(node.id == id));
    
            return updatedNodes;
          })
          setEdges(edges => {
            const updatedEdges = edges.filter(edge => edge.source !== id && edge.target !== id);
    
            return updatedEdges;
          })
        }
  
    return (
      <WorkflowNode
        title={title}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
        showToolbar
      >
        <NodeStatusIndicator status={status}>
          <BaseNode status={status} onDoubleClick={onDoubleClick}>
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
            </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";
