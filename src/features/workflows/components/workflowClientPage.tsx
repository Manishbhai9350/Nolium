import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import WorkflowsList from "./workflowsList";

const workflowClientPage = () => {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error...</p>} >
        <Suspense fallback={<p>Loading...</p>}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default workflowClientPage