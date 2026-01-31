import { channel, topic } from "@inngest/realtime";

interface geminiChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const GEMINI_CHANNEL_NAME = "gemini-channel";

export const GeminiChannel = channel(GEMINI_CHANNEL_NAME).addTopic(
  topic("status").type<geminiChannelTopicProps>(),
);
