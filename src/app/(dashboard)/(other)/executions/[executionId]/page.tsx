import { ExecutionView } from '@/features/executions/components/execution/execution-view';
import { prefetchExecution } from '@/features/executions/server/prefetch';
import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const page = async ({ params }:{ params:Promise<{ executionId: string }> }) => {

    await requireAuth();

    const { executionId } = await params;

    prefetchExecution(executionId)

  return (
    <ExecutionView executionId={executionId} />
  )
}

export default page