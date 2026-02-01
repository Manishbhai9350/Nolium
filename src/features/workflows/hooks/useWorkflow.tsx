"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowParams } from "./workflow-params";

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
    }),
  );
};

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
    }),
  );
};

export const useUpdateWorkflowName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
    }),
  );
};

export const useSaveWorkflow = ({ workflowId }: { workflowId: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.save.mutationOptions({
      onSuccess(data) {
        toast.success(`workflow "${data.name}" saved`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.get.queryOptions({ id: workflowId }),
        );
      },
    }),
  );
};

export const useExecuteWorkflow = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess(data) {
        toast.success(`workflow "${data.name}" executed`);
      },
      onError(error){
        toast.error(`Failed to execute workflow ${error.message}`)
      }
    }),
  );
};

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  const [params] = useWorkflowParams()

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export const useSuspenseWorkflow = ({ workflowId }:{workflowId:string}) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.get.queryOptions({ id:workflowId }));
};