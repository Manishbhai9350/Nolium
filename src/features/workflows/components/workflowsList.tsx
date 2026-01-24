"use client";
import useSuspenseWorkflows from "../hooks/useSuspenseWorkflows";
import WorkflowPagination from "./workflowPagination";

const WorkflowsList = () => {
  const {
    data:{
      hasNextPage,
      hasPrevPage,
      items,
      page,
      pageSize,
      totalPages
    },
    isPending
  } = useSuspenseWorkflows();

  return (
      <div className="flex flex-col flex-1 justify-between">
        {items && JSON.stringify(items, null, 2)}
        <WorkflowPagination
          hasNextpage={hasNextPage}
          hasPrevPage={hasPrevPage}
          page={page}
          totalPages={totalPages}
          disabled={isPending}
        />
      </div>
  );
};

export default WorkflowsList;
