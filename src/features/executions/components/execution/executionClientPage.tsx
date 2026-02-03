import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { ExecutionsEmpty, ExecutionsList } from "./execution";
import { EntityLoading } from "@/components/custom/entity-component";

const ExecutionClientPage = () => {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsEmpty />} >
        <Suspense fallback={<EntityLoading lable="Loading Execution History" />}>
          <ExecutionsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default ExecutionClientPage