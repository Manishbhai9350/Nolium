import { channel, topic } from "@inngest/realtime";

interface GooglFormTriggerChannelTopicProps {
  nodeId: string;
  status: "loading" | "error" | "success";
}

export const GOOGLE_FORM_TRIGGER_CHANNEL_NAME = "google-form-trigger-channel"

export const GoogleFormTriggerChannel = channel(GOOGLE_FORM_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<GooglFormTriggerChannelTopicProps>(),
);
