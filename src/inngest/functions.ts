import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    await step.sleep("Spawning Meow....", "5s");
    
    await step.sleep("Feeding Meow....", "3s");

    await step.sleep("Meow Running....", "2s");

    return { message: `Meow Is Running Successfully` };
  },
);