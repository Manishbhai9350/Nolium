import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";
import HandleBars from "handlebars";
import { HttpChannel } from "@/inngest/channels/http-channel";

HandleBars.registerHelper("json", (context) => {
  const stringed = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(stringed);

  return safeString;
});

type HttpExecutorData = {
  variableName?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint?: string;
  body?: string;
};

export const HttpExecutor: NodeExecutor<HttpExecutorData> = async ({
  context,
  nodeId,
  step,
  data,
  publish,
}) => {
  // Pulish "loading" status to the current Node;

  await publish(
    HttpChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  try {
    const result = await step.run("http-executor", async () => {
      if (!data.variableName) {
        throw new NonRetriableError(
          "HTTP Request Execution Error: No Variable Name Provided",
        );
      }
      if (!data.method) {
        throw new NonRetriableError(
          "HTTP Request Execution Error: No Method Was Provided",
        );
      }
      if (!data.endpoint) {
        throw new NonRetriableError(
          "HTTP Request Execution Error: No Endpoint Was Provided",
        );
      }

      const variableName = data.variableName;
      const method = data.method;
      const endpoint = data.endpoint;
      const body = data.body;


      const kyOptions: Options = {
        method,
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const compiledBody = HandleBars.compile(body || "{}")(context);
        kyOptions.body = compiledBody;
        kyOptions.headers = {
          "Content-Type": "applicaton/json",
        };
      }

      const parsedEndpoint = HandleBars.compile(endpoint)(context);
      const parsedVariableName = HandleBars.compile(variableName)(context);

      const response = await ky(parsedEndpoint, kyOptions);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          data: responseData || "No Data",
          statusText: response.statusText,
          status: response.status,
        },
      };

      return {
        ...context,
        [parsedVariableName]: responsePayload,
      };
    });

    await publish(
      HttpChannel().status({
        nodeId,
        status: "success",
      }),
    );

    console.log(result)

    return result;
  } catch (error) {
    await publish(
      HttpChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
