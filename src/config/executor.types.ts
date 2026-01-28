import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export type NodeExecutorProps<TData = Record<string, unknown>> = {
  data: TData;
  nodeId: string;
  context: WorkflowContext;
  step: StepTools;
  // pulish: TODO: Add Realtime Later
};

export type NodeExecutor<TData = Record<string, unknown>> = (
  props: NodeExecutorProps<TData>,
) => Promise<WorkflowContext>;
