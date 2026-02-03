'use client';
import { useTRPC } from "@/trpc/client";
import { useExecutionParams } from "./execution-params";
import { useSuspenseQuery } from "@tanstack/react-query";



export const useSuspenseExecutions = () => {
  const trpc = useTRPC();

  const [params] = useExecutionParams()

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

export const useSuspenseExecution = ({ id }:{id:string}) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.get.queryOptions({ id }));
};