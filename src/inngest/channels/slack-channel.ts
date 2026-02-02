import { channel, topic } from "@inngest/realtime";

interface SlackChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const SLACK_CHANNEL_NAME = "slack-channel";

export const slackChannel = channel(SLACK_CHANNEL_NAME).addTopic(
  topic("status").type<SlackChannelTopicProps>(),
);
