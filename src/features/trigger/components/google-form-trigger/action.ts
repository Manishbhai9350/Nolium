import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { GoogleFormTriggerChannel } from "@/inngest/channels/googl-form-trigger-channel";

export type GoogleFormTriggerToken = Realtime.Token<typeof GoogleFormTriggerChannel, ["status"]>;

export async function FetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: GoogleFormTriggerChannel(),
    topics: ["status"],
  });

  return token;
}
