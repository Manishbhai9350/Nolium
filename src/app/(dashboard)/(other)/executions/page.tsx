import { ExecutionHeader } from "@/features/executions/components/execution/execution";
import ExecutionClientPage from "@/features/executions/components/execution/executionClientPage";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { prefetchParams } from "@/features/executions/server/prefetch-params";
import { requireAuth } from "@/lib/auth-utils"
import { SearchParams } from "nuqs";

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  await requireAuth();

  const params = await prefetchParams(searchParams);
  prefetchExecutions(params);
     return (
       <div className="p-4 bg-slate-100 flex flex-col md:px-6 md:py-4 max-h-screen h-full">
         <ExecutionHeader />
         <ExecutionClientPage />
       </div>
     );
}

export default page