import type { NodeExecutor } from '@/config/executor.types';

type ManualTriggerData = Record<string,unknown>;

export const ManualTrigger:NodeExecutor<ManualTriggerData> = async ({
    context,
    nodeId,
    step,
}) => {

    // Pulish "loading" status to the current Node;
    
    const result = await step.run('manual-trigger', () => context);
    
    // Pulish "success" status to the current Node;

    return result;
}