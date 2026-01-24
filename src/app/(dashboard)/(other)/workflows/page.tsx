import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { prefetchParams } from "@/features/workflows/server/prefetch-params";
import { SearchParams } from "nuqs/server";
import WorkflowClientPage from "@/features/workflows/components/workflowClientPage";
import WorkflowHeader from "@/features/workflows/components/workflowHeader";

interface WorkflowProps {
  searchParams: Promise<SearchParams>;
}

const page = async ({ searchParams }: WorkflowProps) => {
  await requireAuth();

  const params = await prefetchParams(searchParams);
  prefetchWorkflows(params);

  return (
    <div className="p-4 flex flex-col md:px-6 md:py-4 max-h-screen h-full">
      <WorkflowHeader />
      <WorkflowClientPage />
    </div>
  );
};

export default page;
