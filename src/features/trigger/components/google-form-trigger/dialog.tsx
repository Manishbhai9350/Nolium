"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: () => void;
  nodeId?: string;
}

const GoogleFormTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
  const pathname = usePathname();
  const { workflowId }: { workflowId: string } = useParams();

  const baseUrl = process.env.NEXT_BASE_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhook/google-form?workflowId=${workflowId}`;

  const handleCopy = async (v:string,slug: string) => {
    try {
      await navigator.clipboard.writeText(v)
      toast.success(`${slug} copied to clipboard`)
    } catch {
      toast.error(`Failed to copy ${slug} to clipboard`)
    }
  }

  return (
    <Dialog
      key={nodeId} // 👈 ensures isolation between nodes
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <div className="w-full flex justify-center items-center">
            <Image src="/logos/googleform.svg" alt="" width={30} height={30} />
          </div>
          <DialogTitle className="text-center text-3xl">
            Google Form Trigger
          </DialogTitle>
          <DialogDescription className="text-center text-md">
            Google Form Trigger node
          </DialogDescription>
        </DialogHeader>

        <div >
          <Label htmlFor="webhook-url" className="text-md font-medium">Webhook Url</Label>
          <div className="flex gap-2 py-2">
            <Input className="font-mono text-sm text-muted-foreground" value={webhookUrl} readOnly />
            <Button type="button" variant="outline" onClick={() => handleCopy(webhookUrl,'webhook Url')} >
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-slate-200/50 rounded-sm">
          <h4>Setup Instructions:</h4>
          <ul className="list-inside px-2 list-decimal text-sm text-muted-foreground space-y-1">
            <li>Open your Google Form</li>
            <li>Click the three dots menu  Go to → <strong>Script Editor</strong></li>
            <li>Copy and paste the script below</li>
            <li>Replace WEBHOOK URL with your webhook url above</li>
            <li>Save and click {`"Triggers"`} → Add Trigger</li>
            <li>Choose Form from → On form submite → Save</li>
          </ul>
        </div>

        <div className="space-y-2 p-4 bg-slate-200/50 rounded-sm">
          <h2>Google Apps Script</h2>
          <Button variant="outline" type="button" onClick={() => handleCopy(
            generateGoogleFormScript(webhookUrl),
            'Google App Script'
          )}>
            <CopyIcon />
            Copy Google Apps Script
          </Button>
          <p className="text-sm text-muted-foreground">
            This script includes your webhook URL and handle form submissions
          </p>
        </div>

        <div className="space-y-2 p-4 bg-slate-200/50 rounded-sm">
          <h2>Available Variables</h2>
          <ul className="list-none text-sm text-muted-foreground">
            <li>
              <code>{"{{ googleForm.respondentEmail }}"}</code> - Respondent&apos;s Email
              </li>
            <li className="list-none">
              <code>{"{{ googleForm.responses['Questions Name'] }}"}</code> - Specific answer
            </li>
            <li className="list-none">
              <code>{"{{json googleForm.responses}}"}</code> - All responses as JSON
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleFormTriggerDialog;
