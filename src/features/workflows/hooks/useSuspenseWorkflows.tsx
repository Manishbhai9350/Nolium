"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useWorkflowParams } from "./useWorkflowParams";

const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  const [params] = useWorkflowParams()

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export default useSuspenseWorkflows;
