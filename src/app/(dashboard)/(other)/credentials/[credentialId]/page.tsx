import {
  EntityError,
  EntityLoading,
} from "@/components/custom/entity-component";
import { CredentialView } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    credentialId:string
  }>
}

const page = async({params}:Props) => {
  await requireAuth();
  const { credentialId } = await params;
  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<EntityError error="Failed to load Credentials" />}
      >
        <Suspense
          fallback={<EntityLoading lable="Loading Credentials" />}
        >
          <CredentialView credentialId={credentialId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default page;
