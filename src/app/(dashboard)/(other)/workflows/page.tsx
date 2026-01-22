'use client';

import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
// import { requireAuth } from '@/lib/auth-utils'

const WorkflowsPage = /* async */ () => {
  const trcp = useTRPC()
  const testAI = useMutation(trcp.testAi.mutationOptions({
    onSuccess(){
      toast.success("Test AI")
    },
    onError({ message }) {
      toast.error(message)
    },
  }))
  // await requireAuth()
  return (
    <div className='p-8'>
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
        Test AI
      </Button>
    </div>
  )
}

export default WorkflowsPage