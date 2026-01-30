import { channel, topic } from "@inngest/realtime";

interface ManualTriggerChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-channel"

export const ManualTriggerChannel = channel(MANUAL_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<ManualTriggerChannelTopicProps>(),
);
