import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const WorkflowsPage = async () => {
  await requireAuth()
  return (
    <div>WorkflowPage</div>
  )
}

export default WorkflowsPage