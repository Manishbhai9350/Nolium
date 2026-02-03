import { ExecutionStatus } from "@/generated/prisma/enums";
import { CheckCircle2Icon, CrossIcon, Loader2Icon, LoaderIcon, TriangleAlertIcon } from "lucide-react";



export const getExecutionIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.RUNNING:
      return <LoaderIcon className="size-6 text-blue-600 animate-spin" />;
    case ExecutionStatus.FAILED:
      return <TriangleAlertIcon className="size-6 text-red-600" />;
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-6 text-green-600" />;
    default:
      return <LoaderIcon className="size-6 text-blue-600 animate-spin" />;
  }
};


export const formatStatus = (status: ExecutionStatus): string => status.slice(0, 1) + status.slice(1).toLowerCase()