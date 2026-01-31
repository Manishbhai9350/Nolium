import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "./executor.types";
import { ManualTrigger } from "@/features/trigger/components/manual-trigger/manual-trigger";
import { HttpExecutor } from "@/features/executions/components/http-request/http-executor";
import { GoogleFormTrigger } from "@/features/trigger/components/google-form-trigger/google-form-trigger";
import { StripeTriggerExecutor } from "@/features/trigger/components/stripe-trigger/stripe-executor";
import { GeminiExecutor } from "@/features/executions/components/gemini/gemini-executor";
import { OpenAiExecutor } from "@/features/executions/components/openai/openai-executor";
import { AnthropicExecutor } from "@/features/executions/components/anthropic/anthropic-executor";


export const executors:Record<NodeType,NodeExecutor> = {
    [NodeType.INITIAL]: ManualTrigger,
    [NodeType.MANUAL_TRIGGER]: ManualTrigger,
    [NodeType.HTTP_REQUEST]: HttpExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerExecutor,
    [NodeType.GEMINI]: GeminiExecutor,
    [NodeType.ANTHROPIC]: AnthropicExecutor,
    [NodeType.GPT]: OpenAiExecutor,
}


export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executors[type];

    if(!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
}