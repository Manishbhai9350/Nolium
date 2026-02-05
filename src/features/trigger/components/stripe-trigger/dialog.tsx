"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: () => void;
  nodeId?: string;
}

const StripeTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
  const pathname = usePathname();
  const { workflowId }: { workflowId: string } = useParams();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_APP_URL ;
  const webhookUrl = `${baseUrl}/api/webhook/stripe?workflowId=${workflowId}`;

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
            <Image src="/logos/Stripe.svg" alt="" width={30} height={30} />
          </div>
          <DialogTitle className="text-center text-3xl">
            Stripe Event
          </DialogTitle>
          <DialogDescription className="text-center text-md">
            Stripe event when captured starts the flow
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
            <li>Open your Stripe Account Dashboard</li>
            <li>Go to Developers → <strong>Webhooks</strong></li>
            <li>Click <strong>{`"Add endpoint"`}</strong></li>
            <li>Pase the webhook url above</li>
            <li>Select event to listen for (e.g., payment.intent.succeeded)</li>
            <li>Save and copy the signing secret</li>
          </ul>
        </div>

        <div className="space-y-2 p-4 bg-slate-200/50 rounded-sm">
          <h2>Available Variables</h2>
          <ul className="list-none text-sm text-muted-foreground">
            <li>
              <code>{"{{ stripe.raw.amout }}"}</code> - Payment amount
              </li>
            <li>
              <code>{"{{ stripe.raw.currency }}"}</code> - Currency code
            </li>
            <li>
              <code>{"{{json stripe.raw.customerId}}"}</code> - Customer ID
            </li>
            <li>
              <code>{"{{json stripe}}"}</code> - Full event data as JSON
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StripeTriggerDialog;
