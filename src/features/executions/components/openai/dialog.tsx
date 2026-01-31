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
import { AVAILABLE_MODELS } from "./utils";

const OpenAIFormSchema = z.object({
  variableName: z
    .string()
    .regex(/^[A-Za-z_$][A-Za-z0-9_$.{}]*$/, {
      message:
        "Variable Name must start with a letter, _, or $ and can only contain letters, numbers, _, $, ., and {.",
    }),
  // .optional()
  // model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z
    .string()
    .min(10, "User Prompt is required and shoult be atleast 10 characters"),
});

export type FormDataType = z.infer<typeof OpenAIFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (v: FormDataType) => void;
  initial: FormDataType;
  /** recommended: pass nodeId to fully isolate dialog */
  nodeId?: string;
}

const OpenAIDialog = ({
  open,
  onOpenChange,
  onSave,
  initial,
  nodeId,
}: Props) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(OpenAIFormSchema),
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

  const variableWatch = form.watch("variableName") || "myOpenAI";

  return (
    <Dialog
      key={nodeId} // 👈 ensures isolation between nodes
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure OpenAI </DialogTitle>
          <DialogDescription>Open Ai AI Agent for Automated Results</DialogDescription>
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
                      placeholder={`${variableWatch || "myApiCall"}`}
                    />
                  </FormControl>
                  <FormDescription>
                    Use <code>{variableWatch}</code> to inject data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MODEL */}
            {/* <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The OpenAI model to use</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* System Prompt */}
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`You are an expert Three JS Teacher.`}
                      className="min-h-20"
                    />
                  </FormControl>
                  <FormDescription>
                    Use{" "}
                    <code>{`{{${variableWatch || "myOpenAIVariable"}.aiResponse}}`}</code>{" "}
                    to inject ai response
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Prompt */}
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Generate Instanced Geometry code...`}
                      className="min-h-20"
                    />
                  </FormControl>
                  <FormDescription>
                    Use{" "}
                    <code>{`{{${variableWatch || "myOpenAIVariable"}}}`}</code>{" "}
                    to inject data
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

export default OpenAIDialog;
