import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { AnthropicChannel } from "@/inngest/channels/anthropic-channel";

export type AnthropicToken = Realtime.Token<typeof AnthropicChannel, ["status"]>;

export async function FetchAnthropicRealtimeToken(): Promise<AnthropicToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: AnthropicChannel(),
    topics: ["status"],
  });

  return token;
}
