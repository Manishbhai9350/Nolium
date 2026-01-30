import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { ManualTriggerChannel } from "@/inngest/channels/manual-trigger-channel";

export type ManualTriggerToken = Realtime.Token<typeof ManualTriggerChannel, ["status"]>;

export async function FetchManualTriggerRealtimeToken(): Promise<ManualTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: ManualTriggerChannel(),
    topics: ["status"],
  });

  return token;
}
