import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const WorkflowsPage = async () => {
  await requireAuth()
  return (
    <div>Workflows</div>
  )
}

export default WorkflowsPage