import { WorkflowPageHeader } from "@/features/workflows/components/workflow";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";

interface WorkflowProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const WorkflowPage = async ({ params }: WorkflowProps) => {
  await requireAuth();

  const { workflowId } = await params;
  prefetchWorkflow(workflowId);
  return (
    <main className="w-full h-full flex flex-col">
      <WorkflowPageHeader workflowId={workflowId} />
      <div className="flex-1">
        editor
      </div>
    </main>
  );
};

export default WorkflowPage;
