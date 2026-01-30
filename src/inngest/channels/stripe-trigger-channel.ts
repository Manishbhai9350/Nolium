import { channel, topic } from "@inngest/realtime";

interface StripeTriggerChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const STRIPE_TRIGGER_CHANNEL_NAME = "google-form-trigger-channel"

export const StripeTriggerChannel = channel(STRIPE_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<StripeTriggerChannelTopicProps>(),
);
