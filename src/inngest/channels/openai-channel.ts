import { channel, topic } from "@inngest/realtime";

interface openAiChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const OPENAI_CHANNEL_NAME = "OPENAI-channel";

export const OpenAiChannel = channel(OPENAI_CHANNEL_NAME).addTopic(
  topic("status").type<openAiChannelTopicProps>(),
);
