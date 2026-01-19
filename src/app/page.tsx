import { requireAuth } from "@/lib/auth-utils";
import LogoutButton from "./_components/logout";

export default async function Home() {

  await requireAuth()

  // const {} = await 

  return (
    <main className="bg-zinc-800 text-white h-screen">
      <p>Logged In User</p>
      <LogoutButton />
    </main>
  );
}
