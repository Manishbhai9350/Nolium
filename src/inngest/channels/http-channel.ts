import { channel, topic } from "@inngest/realtime";

interface HttpChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const HTTP_CHANNEL_NAME = "http-channel";

export const HttpChannel = channel(HTTP_CHANNEL_NAME).addTopic(
  topic("status").type<HttpChannelTopicProps>(),
);
