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

const DiscordFormSchema = z.object({
  variableName: z.string().regex(/^[A-Za-z_$][A-Za-z0-9_$.{}]*$/, {
    message:
      "Variable Name must start with a letter, _, or $ and can only contain letters, numbers, _, $, ., and {.",
  }),
  username: z.string().optional(),
  webhookUrl: z.string(),
  content: z.string().max(2000,'Discord Message Content Can Not Exceed 2000 Characters')
});

export type FormDataType = z.infer<typeof DiscordFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (v: FormDataType) => void;
  initial: FormDataType;
  /** recommended: pass nodeId to fully isolate dialog */
  nodeId?: string;
}

const DiscordDialog = ({
  open,
  onOpenChange,
  onSave,
  initial,
  nodeId,
}: Props) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(DiscordFormSchema),
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

  const variableWatch = form.watch("variableName") || "myDiscord";

  return (
    <Dialog
      key={nodeId} // 👈 ensures isolation between nodes
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Discord </DialogTitle>
          <DialogDescription>
            Discord node for automated messages.
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
                      placeholder={`${variableWatch || "myDiscord"}`}
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
                      placeholder="https://discord.com/webhooks/...."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get the Webhook Url from <strong>Discord</strong> → <strong>Channel Settings</strong> → <strong>Integrations</strong> → <strong>Webhooks</strong>
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
                    <code>{`{{${variableWatch || "myDiscordVariable"}.discord.content}}`}</code>{" "}
                    to inject ai response
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Prompt */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`Ex: MyDiscordBot`}
                    />
                  </FormControl>
                  <FormDescription>
                    Overwrite the bot username.
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

export default DiscordDialog;
