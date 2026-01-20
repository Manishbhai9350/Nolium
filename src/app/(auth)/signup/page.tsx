import SignupForm from "@/features/auth/signup-form";
import { requireUnAuth } from "@/lib/auth-utils";

const page = async () => {
  await requireUnAuth();

  return (
    <main className="w-full h-fit">
      <SignupForm />
    </main>
  );
};

export default page;
