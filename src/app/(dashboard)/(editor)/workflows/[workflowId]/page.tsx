import { requireAuth } from "@/lib/auth-utils";


interface WorkflowProps {
    params: Promise<{
        workflowId: string;
    }>
}

const WorkflowPage = async ({ params }:WorkflowProps) => {

    await requireAuth()

    const { workflowId } = await params;
  return (
    <div>Workflow Id: {workflowId}</div>
  )
}

export default WorkflowPage