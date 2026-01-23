'use client';

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query"




const useSuspenseWorkflows = () => {

    const trpc = useTRPC()

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions())
}



export default useSuspenseWorkflows