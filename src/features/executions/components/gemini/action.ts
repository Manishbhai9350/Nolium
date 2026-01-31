import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { GeminiChannel } from "@/inngest/channels/gemini-channel";

export type GeminiToken = Realtime.Token<typeof GeminiChannel, ["status"]>;

export async function FetchGeminiRealtimeToken(): Promise<GeminiToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: GeminiChannel(),
    topics: ["status"],
  });

  return token;
}
