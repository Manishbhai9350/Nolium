import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
// import { GoogleGenerativeAIModel } from "./utils";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { AnthropicChannel } from "@/inngest/channels/anthropic-channel";

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
};

export const AnthropicExecutor: NodeExecutor<AnthropicExecutorData> = async ({
  context,
  nodeId,
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
    // if (!data.model) {
    //   throw new NonRetriableError(
    //     "Anthropic Execution Error: No Anthropic Model Provided",
    //   );
    // }
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

    const ANTHROPIC_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const google = createAnthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: google(/* model ||  */"claude-sonnet-4-0"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const responseText =
      steps[0].content[0].type == "text" ? steps[0].content[0].text : "";

    await publish(
      AnthropicChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [variableName]:{
        AnthropicResponse:responseText,
      }
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
