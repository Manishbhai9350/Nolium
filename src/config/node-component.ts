import { InitialNode } from "@/components/custom/initial-node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { HTTPExecutionNode } from "@/features/executions/components/http-request/node";
import { OpenAINode } from "@/features/executions/components/openai/node";
import { SlackNode } from "@/features/executions/components/slack/node";
import { GoogleFormTriggerNode } from "@/features/trigger/components/google-form-trigger/node";
import { TriggerNode } from "@/features/trigger/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/trigger/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";


export const nodeComponent = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HTTPExecutionNode,
    [NodeType.MANUAL_TRIGGER]: TriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.GPT]: OpenAINode,
    [NodeType.ANTHROPIC]: AnthropicNode,
    [NodeType.DISCORD]: DiscordNode,
    [NodeType.SLACK]: SlackNode,

} as const satisfies NodeTypes

export type registeredNodeType = keyof typeof nodeComponent;