import { CredentialsHeader } from "@/features/credentials/components/credential";
import CredentialClientPage from "@/features/credentials/components/credentialClientPage";
import { requireAuth } from "@/lib/auth-utils";

const CredentialsPage = async () => {
  await requireAuth();
  return (
    <div className="p-4 bg-slate-100 flex flex-col md:px-6 md:py-4 max-h-screen h-full">
      <CredentialsHeader />
      <CredentialClientPage />
    </div>
  );
};

export default CredentialsPage;
