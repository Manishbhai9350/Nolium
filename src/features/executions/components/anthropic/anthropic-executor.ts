import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
// import { GoogleGenerativeAIModel } from "./utils";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { AnthropicChannel } from "@/inngest/channels/anthropic-channel";
import prisma from "@/lib/db";
import { dcrypt } from "@/lib/encryption";

HandleBars.registerHelper("json", (context) => {
  const stringed = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(stringed);

  return safeString;
});

type AnthropicExecutorData = {
  variableName?: string;
  // model?: GoogleGenerativeAIModel;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

export const AnthropicExecutor: NodeExecutor<AnthropicExecutorData> = async ({
  context,
  nodeId,
  userId,
  step,
  data,
  publish,
}) => {
  // Pulish "loading" status to the current Node;

  await publish(
    AnthropicChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    if (!data.variableName) {
      throw new NonRetriableError(
        "Anthropic Execution Error: No Variable Name Provided",
      );
    }
    if (!data.credentialId) {
      throw new NonRetriableError(
        "Anthropic Execution Error: No Anthropic Credential Provided",
      );
    }
    if (!userId) {
      throw new NonRetriableError(
        "Anthropic Execution Error: Invalid User",
      );
    }
    if (!data.userPrompt) {
      throw new NonRetriableError(
        "Anthropic Execution Error: No User Prompt Provided",
      );
    }

    const variableName = data.variableName;
    // const model = data.model;
    const systemPrompt = data.systemPrompt
      ? HandleBars.compile(data.systemPrompt)(context)
      : "Your are a heplful assistent";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch users api key;

    const anthropicApiKey = await step.run(
      "fetching-anthropic-key",
      async () => {
        return prisma.credential.findUnique({
          where: {
            id: data.credentialId,
            userId
          },
        });
      },
    );

    if (!anthropicApiKey || !anthropicApiKey.value) {
      throw new NonRetriableError(
        "Anthropic Execution Error: No Anthropic Credential Provided",
      );
    }

    const ANTHROPIC_API_KEY = dcrypt(anthropicApiKey.value);

    const google = createAnthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: google(/* model ||  */ "claude-sonnet-4-0"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const responseText =
      steps[0]?.content[0]?.type == "text" ? steps[0].content[0].text : "";

    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [variableName]: {
        AnthropicResponse: responseText,
      },
    };
  } catch (error) {
    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw error;
  }
};
