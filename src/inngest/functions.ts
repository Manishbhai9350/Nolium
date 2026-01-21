import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import * as Sentry from '@sentry/nextjs'

export const generateAI = inngest.createFunction(
  { id: "generate.ai" },
  { event: "generate/ai" },
  async ({ event, step }) => {

    Sentry.logger.info('Starting AI Text Generations')

    // Generating Text From Gemini
    const geminiSteps = await step.ai.wrap("gemini-ai-response", generateText, {
      model: google("gemini-2.5-flash"),
      prompt:
        "Let f(x) = (x + 1)/(x - 1) what is f'(x) = ? or the Derivative of f(x)",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    // Generating Text From OpenAI
    const openAiSteps = await step.ai.wrap("open-ai-response", generateText, {
      model: openai("gpt-4"),
      prompt:
        "Let f(x) = (x + 1)/(x - 1) what is f'(x) = ? or the Derivative of f(x)",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    // Generating Text From Claude
    const claudeAiSteps = await step.ai.wrap(
      "claude-ai-response",
      generateText,
      {
        model: anthropic("gpt-4"),
        prompt:
          "Let f(x) = (x + 1)/(x - 1) what is f'(x) = ? or the Derivative of f(x)",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    // Generating Text From DeepSeek
    const deepAiSteps = await step.ai.wrap("deep-ai-response", generateText, {
      model: deepseek("gpt-4"),
      prompt:
        "Let f(x) = (x + 1)/(x - 1) what is f'(x) = ? or the Derivative of f(x)",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    return {
      message: "Ai model queued",
    };
  },
);
