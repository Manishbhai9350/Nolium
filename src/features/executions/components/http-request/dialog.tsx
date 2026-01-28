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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const HttpFormSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  endpoint: z
    .string()
    .min(1, "Endpoint is required")
    .refine((value) => {
      // Allow {{variables}} in URL
      const cleaned = value.replace(/{{.*?}}/g, "test");
      try {
        new URL(cleaned);
        return true;
      } catch {
        return false;
      }
    }, "Enter a valid URL"),
  body: z.string().optional().nullable(),
});

export type FormDataType = z.infer<typeof HttpFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (v: FormDataType) => void;
  initial: FormDataType;
  /** recommended: pass nodeId to fully isolate dialog */
  nodeId?: string;
}

const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSave,
  initial,
  nodeId,
}: Props) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(HttpFormSchema),
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

  const method = form.watch("method");
  const enableBody =
    method === "POST" || method === "PUT" || method === "PATCH";

  return (
    <Dialog
      key={nodeId} // 👈 ensures isolation between nodes
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>HTTP Request node</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 my-4"
          >
            {/* METHOD */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The HTTP method to use</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ENDPOINT */}
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://api.example.com/users/{{userId}}"
                    />
                  </FormControl>
                  <FormDescription>
                    Use <code>{"{{variable}}"}</code> to inject data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BODY */}
            {enableBody && (
              <FormField
                control={form.control}
                name="body"
                render={({ field:{value,...rest} }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        value={value || ''}
                        {...rest}
                        placeholder={`{
                            "name": "{{httpResponse.data.name}}",
                            "userId": "{{httpResponse.data.id}}"
                          }`}
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormDescription>JSON body with variables</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

export default HttpRequestDialog;
