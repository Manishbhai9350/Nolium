import { CredentialPageHeader, CredentialsHeader } from "@/features/credentials/components/credential";
import CredentialForm from "@/features/credentials/components/credentialForm";
import { requireAuth } from "@/lib/auth-utils";

interface CredentialProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const page = async ({ params }: CredentialProps) => {
  await requireAuth();

  const { credentialId } = await params;
  return (
    <main className="w-full h-full flex flex-col justify-center items-center p-4">
      <CredentialForm />
    </main>
  );
};

export default page;
