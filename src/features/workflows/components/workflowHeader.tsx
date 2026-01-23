"use client";

import EntityComponent from "@/components/custom/entity-component";
import UseUpdrageModel from "@/components/custom/useUpgradeModel";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const WorkflowHeader = () => {
  const trpc = useTRPC();
  const router = useRouter()

  const { handleError, modal } = UseUpdrageModel()

  const create = useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess(data) {
        router.push(`/workflows/${data.id}`)
        toast.success(`Workflow created ${data.name}`);
      },
      onError(error) {
        toast.error(error.message);
        handleError(error)
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
    </>
  );
};

export default WorkflowHeader;
