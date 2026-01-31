import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { OpenAiChannel } from "@/inngest/channels/openai-channel";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

HandleBars.registerHelper("json", (context) => {
  const stringed = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(stringed);

  return safeString;
});

type OpenAiExecutorData = {
  variableName?: string;
  // model?: GoogleGenerativeAIModel;
  systemPrompt?: string;
  userPrompt?: string;
};

export const OpenAiExecutor: NodeExecutor<OpenAiExecutorData> = async ({
  context,
  nodeId,
  step,
  data,
  publish,
}) => {
  // Pulish "loading" status to the current Node;

  await publish(
    OpenAiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    if (!data.variableName) {
      throw new NonRetriableError(
        "OpenAi Execution Error: No Variable Name Provided",
      );
    }
    // if (!data.model) {
    //   throw new NonRetriableError(
    //     "OpenAi Execution Error: No OpenAi Model Provided",
    //   );
    // }
    if (!data.userPrompt) {
      throw new NonRetriableError(
        "OpenAi Execution Error: No User Prompt Provided",
      );
    }

    const variableName = data.variableName;
    // const model = data.model;
    const systemPrompt = data.systemPrompt
      ? HandleBars.compile(data.systemPrompt)(context)
      : "Your are a heplful assistent";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch users api key;

    const OpenAi_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const gpt = createOpenAI({
      apiKey: OpenAi_API_KEY,
    });

    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: gpt(/* model ||  */"gpt-4"),
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
      OpenAiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [variableName]:{
        openAiResponse:responseText,
      }
    };
  } catch (error) {
    await publish(
      OpenAiChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw error;
  }
};
