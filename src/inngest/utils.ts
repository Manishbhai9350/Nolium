import { inngest } from "./client";
import { createId } from '@paralleldrive/cuid2';


export async function SendWorkflowExecution(data: Record<string,unknown>){
    await inngest.send({
        name: "workflow/execute.workflow",
        data,
        id: createId() 
    })
}