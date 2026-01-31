import { channel, topic } from "@inngest/realtime";

interface AnthropicChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const ANTHROPIC_CHANNEL_NAME = "Anthropic-channel";

export const AnthropicChannel = channel(ANTHROPIC_CHANNEL_NAME).addTopic(
  topic("status").type<AnthropicChannelTopicProps>(),
);
