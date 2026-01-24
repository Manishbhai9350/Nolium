import { Button } from "@/components/ui/button";
import { useWorkflowParams } from "../hooks/useWorkflowParams";

interface WorkflowPaginationProps {
  page: number;
  totalPages: number;
  hasNextpage: boolean;
  hasPrevPage: boolean;
  disabled?: boolean;
}

const WorkflowPagination = ({
  hasNextpage,
  hasPrevPage,
  page,
  totalPages,
  disabled,
}: WorkflowPaginationProps) => {
  const [params, setParams] = useWorkflowParams();

  function onNext() {
    if (!hasNextpage) return;
    setParams({
      ...params,
      page: page + 1,
    });
  }

  function onPrevious() {
    if (!hasPrevPage) return;
    setParams({
      ...params,
      page: page - 1,
    });
  }

  return (
    <div className="w-full h-fit flex justify-between items-center">
      <p className="text-md text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="pagination-buttons flex gap-6">
        <Button
          variant="outline"
          disabled={disabled || !hasPrevPage}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={disabled || !hasNextpage}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WorkflowPagination;
