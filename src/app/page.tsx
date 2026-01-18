
import { getQueryClient, trpc } from "@/trpc/server";
import Client from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())

  return (
    <main className="bg-zinc-800 text-white h-screen">
      <h1>Cheetah Hi Kehde</h1>
      <p>Users</p>
      <HydrationBoundary state={dehydrate(queryClient)} >
        <Client />
      </HydrationBoundary>
    </main>
  );
}
