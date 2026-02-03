"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSuspenseExecution } from "../../hooks/useExecutions";
import { formatStatus, getExecutionIcon } from "../../utils";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution, isPending } = useSuspenseExecution({
    id: executionId,
  });

  const [stackOpen, setStackOpen] = useState(false);

  const duration = execution.completedAt
    ? (new Date(execution.completedAt).getTime() -
        new Date(execution.startedAt).getTime()) /
      1000
    : null;

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Output copied to clipboard`);
    } catch {
      toast.error(`Failed to copy Output to clipboard`);
    }
  };

  return (
    <div className="w-full h-full px-6 py-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-start gap-4">
            {getExecutionIcon(execution.status)}
            <div className="flex flex-col">
              <CardTitle>{formatStatus(execution.status)}</CardTitle>
              <CardDescription>
                Execution for {execution.workflow.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xl">Workflow</p>
              <Link
                href={`/workflows/${execution.workflow.id}`}
                prefetch
                className="text-md text-primary hover:underline"
              >
                {execution.workflow.name}
              </Link>
            </div>
            <div>
              <p className="text-xl">Status</p>
              <p className="text-sm text-muted-foreground">
                {formatStatus(execution.status)}
              </p>
            </div>
            <div>
              <p className="text-xl">Started</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(execution.startedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {!!execution.completedAt && (
              <div>
                <p className="text-xl">Completed</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(execution.completedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            )}
            {!!duration && (
              <div>
                <p className="text-xl">Duration</p>
                <p className="text-sm text-muted-foreground">{duration}s</p>
              </div>
            )}
            <div>
              <p className="text-xl">Event Id</p>
              <p className="text-sm text-muted-foreground">
                {execution.inngestEventId}
              </p>
            </div>
          </div>
          {execution.status == "FAILED" && (
            <div className="my-4 flex flex-col gap-2 p-2 bg-red-50 w-full rounded-md space-y-1">
              <div>
                <h3 className="text-red-900">Error</h3>
                <p className="text-red-800 font-mono">{execution.error}</p>
              </div>
              <Collapsible open={stackOpen} onOpenChange={setStackOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="destructive">
                    {stackOpen ? "Hide Error Trace" : "Open Error Trace"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="text-mono text-wrap overflow-x-hidden text-red-800">
                    {JSON.stringify(execution.errorStack, null, 2)}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {execution.status == "SUCCESS" && (
            <div className="my-4 flex flex-col gap-2 p-2 bg-gray-50 w-full rounded-md space-y-1">
              <div className="flex justify-between items-center w-full">
                <p className="text-xl">Output:</p>
                <Button
                  onClick={() => handleCopy(JSON.stringify(execution.output,null,))}
                  variant="outline"
                >
                  <CopyIcon />
                </Button>
              </div>
              <pre className="font-mono text-muted-foreground">
                {JSON.stringify(execution.output, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
