import { channel, topic } from "@inngest/realtime";

interface DiscordChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const DISCORD_CHANNEL_NAME = "discord-channel";

export const discordChannel = channel(DISCORD_CHANNEL_NAME).addTopic(
  topic("status").type<DiscordChannelTopicProps>(),
);
