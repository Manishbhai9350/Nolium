import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord-channel";

export type discordToken = Realtime.Token<typeof discordChannel, ["status"]>;

export async function FetchDiscordRealtimeToken(): Promise<discordToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });

  return token;
}
