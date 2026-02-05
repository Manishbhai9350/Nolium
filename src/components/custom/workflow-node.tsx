import { NodeToolbar, Position } from "@xyflow/react";
import React from "react";
import { Button } from "../ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkflowNodeProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  onSettings?: () => void;
  onDelete?: () => void;
  title?: string;
  description?: string;
}

const WorkflowNode = ({
  children,
  showToolbar,
  onDelete,
  onSettings,
  title,
  description,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <div className="flex justify-center items-center gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={onSettings}>
              <SettingsIcon className="size-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onDelete}>
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </NodeToolbar>
      )}
      {children}
      {title && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-50 text-center"
        >
          <p className="font-medium">{title}</p>
          {description && (
            <p className="text-sm truncate text-muted-foreground">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};

export default WorkflowNode;
