import type { NodeExecutor } from '@/config/executor.types';
import { GoogleFormTriggerChannel } from '@/inngest/channels/googl-form-trigger-channel';

type GoogleFormTriggerData = Record<string,unknown>;

export const GoogleFormTrigger:NodeExecutor<GoogleFormTriggerData> = async ({
    context,
    nodeId,
    step,
    publish
}) => {

    await publish(
        GoogleFormTriggerChannel().status({
            nodeId,
            status:'loading'
        })
    )

    const result = await step.run('google-form-trigger', () => context);
    
    await publish(
        GoogleFormTriggerChannel().status({
            nodeId,
            status:'success'
        })
    )
    return context;
}