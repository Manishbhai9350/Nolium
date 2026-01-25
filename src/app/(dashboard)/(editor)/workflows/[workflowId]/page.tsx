import { WorkflowPageHeader } from "@/features/workflows/components/workflow";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import Editor from "@/features/editor/editor";

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
      <Editor workflowId={workflowId} />
    </main>
  );
};

export default WorkflowPage;
