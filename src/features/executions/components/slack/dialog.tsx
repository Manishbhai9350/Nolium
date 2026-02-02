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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCredentialsByType } from "@/features/credentials/hooks/useCredentials";

const SlackFormSchema = z.object({
  variableName: z.string().regex(/^[A-Za-z_$][A-Za-z0-9_$.{}]*$/, {
    message:
      "Variable Name must start with a letter, _, or $ and can only contain letters, numbers, _, $, ., and {.",
  }),
  webhookUrl: z.string(),
  content: z
    .string()
    .max(2000, "Slack Message Content Can Not Exceed 2000 Characters"),
});

export type FormDataType = z.infer<typeof SlackFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (v: FormDataType) => void;
  initial: FormDataType;
  /** recommended: pass nodeId to fully isolate dialog */
  nodeId?: string;
}

const SlackDialog = ({
  open,
  onOpenChange,
  onSave,
  initial,
  nodeId,
}: Props) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(SlackFormSchema),
    defaultValues: initial,
  });

  /**
   * Reset ONLY when dialog opens
   * (prevents values from disappearing while typing)
   */
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      form.reset(initial);
      wasOpen.current = true;
    }

    if (!open) {
      wasOpen.current = false;
    }
  }, [open, initial, form]);

  const handleSubmit = (values: FormDataType) => {
    onSave(values);
    onOpenChange(false);
  };

  const { data: credentials, isPending: isCredentialsPending } =
    useCredentialsByType({ type: "GPT" });

  // useEffect(() => {
  //   if (credentials?.length && credentials[0]?.id) {
  //     console.log(credentials[0]?.id)
  //     form.setValue("credentialId", credentials[0].id);
  //   }

  //   return () => {};
  // }, [isCredentialsPending, credentials, form]);

  const variableWatch = form.watch("variableName") || "mySlack";

  return (
    <Dialog
      key={nodeId} // 👈 ensures isolation between nodes
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Slack </DialogTitle>
          <DialogDescription>
            Slack node for automated messages.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 my-4"
          >
            {/* Variable Name */}
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`${variableWatch || "mySlack"}`}
                    />
                  </FormControl>
                  <FormDescription>
                    Use <code>{variableWatch}</code> to inject data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isCredentialsPending}
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Webhook Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://Slack.com/webhooks/...."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <div className="space-y-2 p-4 bg-slate-200/50 rounded-sm">
                      <h4>Instructions:</h4>
                      <ul className="list-inside px-2 list-decimal text-sm text-muted-foreground space-y-1">
                        <li>Open your Slack</li>
                        <li>
                          Click the three dots Go to →{" "}
                          <strong>Edit Setting</strong> →{" "}
                          <strong>Integration</strong> →{" "}
                          <strong>Add Automation</strong>
                        </li>
                        <li>
                          Click on <strong>New</strong> →{" "}
                          <strong>Build Workflow</strong> →{" "}
                          <strong>Choose Event</strong>
                        </li>
                        <li>
                          click <strong>From a Webhook</strong> →{" "}
                          <strong>Set Up Variables</strong> → Enter{" "}
                          <strong>{`"nolium-content"`}</strong> in{" "}
                          <strong>Key field</strong> and Data Type
                          <strong>Text</strong>
                        </li>
                        <li>
                          Copy the <strong>Web request URL</strong> → paste the url above in webhook Url
                        </li>
                        <li>
                          Click <strong>Done</strong> →{" "}
                          <strong>Continue</strong>
                        </li>
                        <li>
                          Now click <strong>Add steps</strong> →{" "}
                          <strong>Select a channel</strong> → 
                          <strong>Send a message to a channel</strong> →{" "}
                          <strong>insert a variable</strong> →{" "}
                          <strong>insert all data</strong> or{" "}
                          <strong>nolium-content</strong>
                        </li>
                        <li>Click <strong>Finish Up</strong> → <strong>Save</strong> → <strong>Add channel</strong> That&apos;s it.</li>
                      </ul>
                    </div>
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* System Prompt */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Code for nolium editor is shipped`}
                      className="min-h-20"
                    />
                  </FormControl>
                  <FormDescription>
                    Use{" "}
                    <code>{`{{${variableWatch || "mySlackVariable"}.Slack.content}}`}</code>{" "}
                    to inject ai response
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SlackDialog;
