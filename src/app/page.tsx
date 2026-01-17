import prisma from "@/lib/db";

export default async function Home() {

  const users = await prisma.user.findMany()

  return (
    <main>
      <h1>Cheetah Hi Kehde</h1>
      <p>Users</p>
      {
        JSON.stringify(users)
      }
    </main>
  );
}
