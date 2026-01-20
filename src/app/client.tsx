"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const Client = () => {

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data:meows } = useQuery(trpc.getWorkflows.queryOptions())
    const create = useMutation(trpc.createWorkflow.mutationOptions({
        onSuccess(){
            queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
            toast.success('Created Meowflow')
        },
        onError(ctx){
            toast.warning('Failed To Create meowflow ')
            toast.error(ctx.message)
        }
    }))

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
        <h1>Meowflows</h1>

        {
            JSON.stringify(meows,null,2)
        }
        <Button disabled={create.isPending} onClick={() => {
            create.mutate()
        }} >
            Create Meowflow
        </Button>
    </div>
  )
}

export default Client