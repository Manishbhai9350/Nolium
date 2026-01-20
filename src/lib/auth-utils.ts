import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/login");
    }

    return session;
  } catch (error) {
    console.error("Session fetch failed: ", error);
    return null;
  }
};

export const requireUnAuth = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      redirect("/workflow");
    }

    return session;
  } catch (error) {
    console.error("Session fetch failed: ", error);
    return null;
  }
};
