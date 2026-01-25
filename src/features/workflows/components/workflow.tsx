"use client";
import type { WorkflowModel } from "@/generated/prisma/models/Workflow";
import {
  EntityComponent,
  EntityEmpty,
  EntityItem,
  EntityList,
  EntitySearch,
  MenuAction,
} from "@/components/custom/entity-component";
import UseUpdrageModel from "@/components/custom/useUpgradeModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowParams } from "../hooks/useWorkflowParams";
import useEntitySearch from "@/components/custom/entity-search";
import { useCreateWorkflow, useRemoveWorkflow } from "../hooks/useWorkflow";
import useSuspenseWorkflows from "../hooks/useSuspenseWorkflows";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { TrashIcon, WorkflowIcon } from "lucide-react";

interface WorkflowPaginationProps {
  page: number;
  totalPages: number;
  hasNextpage: boolean;
  hasPrevPage: boolean;
  disabled?: boolean;
}

interface WorkflowItemProps {
  workflow: WorkflowModel;
}

export const WorkflowHeader = () => {
  const router = useRouter();

  const [params, setParams] = useWorkflowParams();

  const { searchValue, setSearch } = useEntitySearch({ params, setParams });

  const { handleError, modal } = UseUpdrageModel();

  const create = useCreateWorkflow();

  const handleCreate = () => {
    create.mutate(undefined, {
      onSuccess(data) {
        router.push(`/workflows/${data.id}`);
        toast.success(`Workflow created ${data.name}`);
      },
      onError(error) {
        toast.error(error.message);
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EntityComponent
        title="Workflows"
        description="Create and manage workflows"
        onNewLabel="Create Workflow"
        onNew={handleCreate}
        disabled={create.isPending}
      />
      <EntitySearch
        value={searchValue}
        onChange={setSearch}
        placeholder="Search Workflow"
      />
    </>
  );
};

export const WorkflowPagination = ({
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
    <div className="w-full !my-4 h-fit flex justify-between items-center">
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

export const WorkflowsEmpty = () => {
  const [params] = useWorkflowParams();
  const create = useCreateWorkflow();
  const router = useRouter();

  const { handleError, modal } = UseUpdrageModel();

  const handleCreate = () => {
    create.mutate(undefined, {
      onSuccess(data) {
        router.push(`/workflows/${data.id}`);
        toast.success(`Workflow created ${data.name}`);
      },
      onError(error) {
        toast.error(error.message);
        handleError(error);
      },
    });
  };

  const emptyText = params.search
    ? `No workflows exist for "${params.search}". Click Add Item to create a workflow.`
    : "You haven't created any workflows yet. Click Add Item to create one.";

  return (
    <>
      {modal}
      <EntityEmpty
        disabled={create.isPending}
        onNew={handleCreate}
        message={emptyText}
      />
    </>
  );
};

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <>
      <div className="flex-1">
        <EntityList
          items={workflows.data.items}
          renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
          getkey={(workflow) => workflow.id}
          emptyView={<WorkflowsEmpty />}
        />
      </div>
      <WorkflowPagination
        hasNextpage={workflows.data.hasNextPage}
        hasPrevPage={workflows.data.hasPrevPage}
        page={workflows.data.page}
        totalPages={workflows.data.totalPages}
        disabled={workflows.isPending || workflows.data.items.length == 0}
      />
    </>
  );
};

export const WorkflowItem = ({ workflow }: WorkflowItemProps) => {
  const remove = useRemoveWorkflow();

  function handleRemove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    remove.mutate(
      { id: workflow.id },
      {
        onSuccess() {
          toast.success(`Removed "${workflow.name}" successfully`);
        },
        onError(error) {
          toast.success(
            `Failed to remove "${workflow.name}, Error: ${error.message}"`,
          );
        },
      },
    );
  }

  const actions: MenuAction[] = [
    {
      action: handleRemove,
      icon: <TrashIcon />,
      label: "Delete",
      variant: "destructive",
    },
  ];

  return (
    <EntityItem
      disabled={remove.isPending}
      href={`/workflows/${workflow.id}`}
      actions={actions}
      description={`
        Created ${formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        Updated ${formatDistanceToNow(workflow.updatedAt || workflow.createdAt, { addSuffix: true })}
        `}
      image={<WorkflowIcon />}
      title={workflow.name}
    />
  );
};
