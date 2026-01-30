import type { NodeExecutor } from "@/config/executor.types";
import { StripeTriggerChannel } from "@/inngest/channels/stripe-trigger-channel";

type StripeTriggerData = Record<string, unknown>;

export const StripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(
    StripeTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  try {
    const result = await step.run("stripe-trigger", () => context);
    await publish(
      StripeTriggerChannel().status({
        nodeId,
        status: "success",
      }),
    );
    return result ?? context;
  } catch (err) {
    await publish(
      StripeTriggerChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw err;
  }
};
