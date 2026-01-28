"use client";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/useWorkflow";
import { FlaskConicalIcon } from "lucide-react";

interface Props {
  workflowId: string;
}

const ManualExecutionWorkflowButton = ({ workflowId }: Props) => {
  const execute = useExecuteWorkflow();

  const handleExecute = () => {
    execute.mutate({ id: workflowId });
  };

  return (
    <Button disabled={execute.isPending} onClick={() => handleExecute()}>
      <FlaskConicalIcon />
      Execute Workflow
    </Button>
  );
};

export default ManualExecutionWorkflowButton;
