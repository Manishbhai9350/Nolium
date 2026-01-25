"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const useSuspenseWorkflow = ({ workflowId }:{workflowId:string}) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.get.queryOptions({ id:workflowId }));
};

export default useSuspenseWorkflow;
