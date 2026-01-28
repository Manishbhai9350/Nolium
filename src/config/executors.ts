import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "./executor.types";
import { ManualTrigger } from "@/features/trigger/components/trigger/manual-trigger";
import { HttpExecutor } from "@/features/executions/components/http-request/http-executor";


export const executors:Record<NodeType,NodeExecutor> = {
    [NodeType.INITIAL]: ManualTrigger,
    [NodeType.MANUAL_TRIGGER]: ManualTrigger,
    [NodeType.HTTP_REQUEST]: HttpExecutor,
}


export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executors[type];

    if(!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
}