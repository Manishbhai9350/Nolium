import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord-channel";
import ky from "ky";
import { decode } from "html-entities";

HandleBars.registerHelper("json", (context) => {
  const stringed = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(stringed);

  return safeString;
});

type DiscordExecutorData = {
  variableName?: string;
  content?: string;
  webhookUrl?: string;
  username?: string;
};

export const DiscordExecutor: NodeExecutor<DiscordExecutorData> = async ({
  context,
  nodeId,
  userId,
  step,
  data,
  publish,
}) => {
  // Pulish "loading" status to the current Node;

  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  try {
    if (!data.variableName) {
      throw new NonRetriableError(
        "Discord Execution Error: No Variable Name Provided",
      );
    }
    if (!data.webhookUrl) {
      throw new NonRetriableError(
        "Discord Execution Error: No webhookUrl Provided",
      );
    }
    if (!userId) {
      throw new NonRetriableError("Discord Execution Error: Invalid User");
    }
    if (!data.content) {
      throw new NonRetriableError(
        "Discord Execution Error: No Message Content Provided",
      );
    }

    const variableName = data.variableName;
    const webhookUrl = decode(HandleBars.compile(data.webhookUrl)(context));
    const content = decode(HandleBars.compile(data.content)(context)).slice(0, 2000);
    const username = data.username
      ? decode(HandleBars.compile(data.username)(context))
      : undefined;

    await step.run("discord-message", async () => {
      await ky.post(webhookUrl, {
        json: {
          content: content,
          username,
        },
      });
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [variableName]: {
        content,
      },
    };
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw error;
  }
};
