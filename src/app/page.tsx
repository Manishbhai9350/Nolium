import { requireAuth } from "@/lib/auth-utils";
import Client from "./client";

export default async function Home() {

  await requireAuth()
  return (
    <main className="bg-zinc-800 text-white h-screen flex justify-center items-center">
      <Client />
    </main>
  );
}
