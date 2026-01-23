'use client';

import useSuspenseWorkflows from "../hooks/useSuspenseWorkflows";
import WorkflowHeader from "./workflowHeader";

const WorkflowsList = () => {

    const workflows = useSuspenseWorkflows()

  return (
    <div className="p-4 md:px-6 md:py-4">
        <WorkflowHeader />
        {
            workflows.data && (
                JSON.stringify(workflows.data,null,2)
            )
        }
    </div>
  )
}

export default WorkflowsList