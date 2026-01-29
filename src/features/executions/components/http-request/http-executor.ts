import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";
import HandleBars from "handlebars";

HandleBars.registerHelper("json", (context) => {
  const stringed = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(stringed);

  return safeString;
});

type HttpExecutorData = {
  variableName: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  body?: string;
};

export const HttpExecutor: NodeExecutor<HttpExecutorData> = async ({
  context,
  nodeId,
  step,
  data,
}) => {
  // Pulish "loading" status to the current Node;

  const result = await step.run("http-executor", async () => {
    const variableName = data.variableName;
    const method = data.method;
    const endpoint = data.endpoint;
    const body = data.body;

    if (!endpoint) {
      throw new NonRetriableError(
        "HTTP Request Execution Error: No Enpoint Was Provided",
      );
    }
    if (!data.variableName) {
      throw new NonRetriableError(
        "HTTP Request Execution Error: Variable Name Provided",
      );
    }

    const kyOptions: Options = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      // Body
      console.log("BODY:", body);
      const compiledBody = HandleBars.compile(body || '{}')(context);
      JSON.parse(compiledBody);
      console.log("Parsed Body:", compiledBody);

      kyOptions.body = compiledBody;
      kyOptions.headers = {
        "Content-Type": "applicaton/json",
      };
    }

    const parsedEndpoint = HandleBars.compile(endpoint)(context);
    const parsedVariableName = HandleBars.compile(variableName)(context);

    const response = await ky(parsedEndpoint, kyOptions)
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

  // Pulish "success" status to the current Node;

  return result;
};
