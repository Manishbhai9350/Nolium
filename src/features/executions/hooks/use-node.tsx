"use client";
import { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface useNodeStatusProps {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  channel,
  nodeId,
  refreshToken,
  topic,
}: useNodeStatusProps) => {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    enabled: true,
    refreshToken,
  });

  useEffect(() => {
    if (data?.length == 0) return;

    const latestMessage = data
      .filter(
        (msg) =>
          msg.kind == "data" &&
          msg.channel == channel &&
          msg.data.nodeId == nodeId &&
          msg.topic == topic,
      )
      .sort((a, b) => {
        if (a.kind == "data" && b.kind == "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return 0;
      })[0];

    if (latestMessage?.kind === "data") {
      (() => {
        setStatus(latestMessage.data.status as NodeStatus);
      })();
    }

    return () => {};
  }, [data, nodeId, topic, channel]);

  return { status };
};
