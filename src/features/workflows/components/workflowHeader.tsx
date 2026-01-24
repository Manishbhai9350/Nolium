"use client";

import EntityComponent, { EntitySearch } from "@/components/custom/entity-component";
import UseUpdrageModel from "@/components/custom/useUpgradeModel";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowParams } from "../hooks/useWorkflowParams";
import useEntitySearch from "@/components/custom/entity-search";

const WorkflowHeader = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const [params, setParams] = useWorkflowParams();

  const { searchValue, setSearch } = useEntitySearch({ params, setParams });

  const { handleError, modal } = UseUpdrageModel();

  const create = useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess(data) {
        router.push(`/workflows/${data.id}`);
        toast.success(`Workflow created ${data.name}`);
      },
      onError(error) {
        toast.error(error.message);
        handleError(error);
      },
    }),
  );

  return (
    <>
      {modal}
      <EntityComponent
        title="Workflows"
        description="Create and manage workflows"
        onNewLabel="Create Workflow"
        onNew={() => create.mutate()}
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

export default WorkflowHeader;
