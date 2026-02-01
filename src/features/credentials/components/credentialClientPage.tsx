import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { EntityError, EntityLoading } from "@/components/custom/entity-component";
import { CredentialsList } from "./credential";

const CredentialClientPage = () => {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EntityError error="Failed to load Credentials" />} >
        <Suspense fallback={<EntityLoading lable="Loading Credentials" />}>
          <CredentialsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default CredentialClientPage