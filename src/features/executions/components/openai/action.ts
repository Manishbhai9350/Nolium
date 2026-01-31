import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { OpenAiChannel } from "@/inngest/channels/openai-channel";

export type openaiToken = Realtime.Token<typeof OpenAiChannel, ["status"]>;

export async function FetchOpenaiRealtimeToken(): Promise<openaiToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: OpenAiChannel(),
    topics: ["status"],
  });

  return token;
}
