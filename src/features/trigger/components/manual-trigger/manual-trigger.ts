import type { NodeExecutor } from '@/config/executor.types';
import { ManualTriggerChannel } from '@/inngest/channels/manual-trigger-channel';

type ManualTriggerData = Record<string,unknown>;

export const ManualTrigger:NodeExecutor<ManualTriggerData> = async ({
    context,
    nodeId,
    step,
    publish
}) => {

    await publish(
        ManualTriggerChannel().status({
            nodeId,
            status:'loading'
        })
    )

    const result = await step.run('manual-trigger', () => context);
    
    await publish(
        ManualTriggerChannel().status({
            nodeId,
            status:'success'
        })
    )
    return result;
}