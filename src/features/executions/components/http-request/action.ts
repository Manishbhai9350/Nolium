import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { HttpChannel } from "@/inngest/channels/http-channel";

export type HttpToken = Realtime.Token<typeof HttpChannel, ["status"]>;

export async function FetchHttpRealtimeToken(): Promise<HttpToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: HttpChannel(),
    topics: ["status"],
  });

  return token;
}
