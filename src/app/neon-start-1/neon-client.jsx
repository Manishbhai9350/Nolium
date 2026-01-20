"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const NeonClient = () => {
  const router = useRouter();

  useEffect(() => {
    const timerId = setTimeout(
      () => {
        console.log("Meow");
        router.push("/neon-start-2");
      },
      1000 * 60 * 1,
    );

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return <div>NeonClient</div>;
};

export default NeonClient;
