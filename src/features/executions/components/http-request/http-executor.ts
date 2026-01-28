import type { NodeExecutor } from "@/config/executor.types";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";

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
    const method = data.method || "GET";
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
      method
    };
    
    if (["POST", "PUT", "PATCH"].includes(method)) {
      kyOptions.body = body;
      kyOptions.headers = {
        'Content-Type':'applicaton/json'
      }
    }

    const response = await ky(endpoint, kyOptions);
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
    }

    if(data.variableName) {
      return {
        ...context,
        [data.variableName] : responsePayload
      }
    }

    return {
      ...context,
      ...responsePayload
    };
  });

  // Pulish "success" status to the current Node;

  return result;
};
