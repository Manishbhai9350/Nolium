import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { GeminiChannel } from "@/inngest/channels/gemini-channel";
import { GoogleGenerativeAIModel } from "./utils";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "@/lib/db";

HandleBars.registerHelper("json", (context) => {
  const stringed = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(stringed);

  return safeString;
});

type GeminiExecutorData = {
  variableName?: string;
  model?: GoogleGenerativeAIModel;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

export const GeminiExecutor: NodeExecutor<GeminiExecutorData> = async ({
  context,
  nodeId,
  step,
  data,
  publish,
}) => {
  // Pulish "loading" status to the current Node;

  await publish(
    GeminiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    if (!data.variableName) {
      throw new NonRetriableError(
        "Gemini Execution Error: No Variable Name Provided",
      );
    }
    if (!data.credentialId) {
      throw new NonRetriableError(
        "Gemini Execution Error: No Gemini Credential Provided",
      );
    }
    if (!data.userPrompt) {
      throw new NonRetriableError(
        "Gemini Execution Error: No User Prompt Provided",
      );
    }

    const variableName = data.variableName;
    // const model = data.model;
    const systemPrompt = data.systemPrompt
      ? HandleBars.compile(data.systemPrompt)(context)
      : "Your are a heplful assistent";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch users api key;

    const geminiApiKey = await step.run("fetching-gemini-key", async () => {
      return prisma.credential.findUnique({
        where: {
          id: data.credentialId,
        },
      });
    });

    if (!geminiApiKey || !geminiApiKey.value) {
      throw new NonRetriableError(
        "OpenAi Execution Error: No Gemini Credential Provided",
      );
    }

    const GEMINI_API_KEY = geminiApiKey.value;

    const google = createGoogleGenerativeAI({
      apiKey: GEMINI_API_KEY,
    });

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(/* model ||  */ "gemini-2.0-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const responseText =
      steps[0]?.content[0]?.type == "text" ? steps[0].content[0].text : "";

    await publish(
      GeminiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [variableName]: {
        geminiResponse: responseText,
      },
    };
  } catch (error) {
    await publish(
      GeminiChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw error;
  }
};
