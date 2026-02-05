/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import type { ExecutionModel } from "@/generated/prisma/models/Execution";
import {
  EntityComponent,
  EntityEmpty,
  EntityItem,
  EntityList,
  MenuAction,
} from "@/components/custom/entity-component";
import { useExecutionParams } from "../../hooks/execution-params";
import {
  useSuspenseExecutions,
  useSuspenseExecution,
} from "../../hooks/useExecutions";
import { Button } from "@/components/ui/button";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getExecutionIcon, formatStatus } from '../../utils'

interface ExecutionPaginationProps {
  page: number;
  totalPages: number;
  hasNextpage: boolean;
  hasPrevPage: boolean;
  disabled?: boolean;
}

interface ExecutionItemProps {
  execution: ExecutionModel & {
    workflow?: {
      name: string;
    };
  };
}

export const ExecutionPageHeader = () => {
  return (
    <header className="w-full flex justify-center items-center border-b px-4 py-2">
      <SidebarTrigger />
    </header>
  );
};

export const ExecutionHeader = () => {
  return (
    <EntityComponent
      title="Executions"
      description="View and manage workflow executions"
    />
  );
};

export const ExecutionPagination = ({
  hasNextpage,
  hasPrevPage,
  page,
  totalPages,
  disabled,
}: ExecutionPaginationProps) => {
  const [params, setParams] = useExecutionParams();

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
    <div className="w-full my-4! h-fit flex justify-between items-center">
      <p className="text-md text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="pagination-buttons flex gap-6">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !hasPrevPage}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          type="button"
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

export const ExecutionsEmpty = () => {
  const emptyText =
    "No execution History found create and execution by clicking Execute Workflow button in workflow";

  return <EntityEmpty message={emptyText} />;
};

export const ExecutionsList = () => {
  const Executions = useSuspenseExecutions();

  return (
    <>
      <div className="flex-1 my-4">
        <EntityList
          items={Executions.data.items}
          renderItem={(execution) => <ExecutionItem execution={execution} />}
          getkey={(execution) => execution.inngestEventId}
          emptyView={<ExecutionsEmpty />}
        />
      </div>
      <ExecutionPagination
        hasNextpage={Executions.data.hasNextPage}
        hasPrevPage={Executions.data.hasPrevPage}
        page={Executions.data.page}
        totalPages={Executions.data.totalPages}
        disabled={Executions.isPending || Executions.data.items.length == 0}
      />
    </>
  );
};

export const ExecutionItem = ({ execution }: ExecutionItemProps) => {
  const description = execution.status == 'SUCCESS'
    ? `${execution.workflow?.name || ""}: Started ${formatDistanceToNow(
        new Date(execution.startedAt),
        { addSuffix: true },
      )}, Took ${formatDuration(
        intervalToDuration({
          start: new Date(execution.startedAt),
          end: new Date(execution.completedAt!),
        }),
      )}s`
    : execution.status == 'RUNNING' ? `${execution.workflow?.name || ""}: Started ${formatDistanceToNow(
      new Date(execution.startedAt),
      { addSuffix: true },
    )}` : `${execution.workflow?.name || ""}: Workflow execution failed`;

  return (
    <EntityItem
      disabled={false}
      href={`/executions/${execution.id}`}
      actions={[]}
      description={description}
      image={
        <div className="h-full aspect-square flex justify-center items-center">
          {getExecutionIcon(execution.status)}
        </div>
      }
      title={formatStatus(execution.status)}
    />
  );
};
