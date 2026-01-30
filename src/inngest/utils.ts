import { inngest } from "./client";



export async function SendWorkflowExecution(data: Record<string,unknown>){
    await inngest.send({
        name: "workflow/execute.workflow",
        data
    })
}