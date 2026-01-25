import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { EntityError, EntityLoading } from "@/components/custom/entity-component";
import { WorkflowsList } from "./workflow";

const workflowClientPage = () => {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EntityError error="Failed to load workflows" />} >
        <Suspense fallback={<EntityLoading lable="Loading Workflows" />}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default workflowClientPage