

interface WorkflowProps {
    params: Promise<{
        workflowId: string;
    }>
}

const WorkflowPage = async ({ params }:WorkflowProps) => {
    const { workflowId } = await params;
  return (
    <div>Workflow Id: {workflowId}</div>
  )
}

export default WorkflowPage