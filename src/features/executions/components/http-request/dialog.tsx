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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type FormMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (v: FormDataType) => void;
  initial: FormDataType;
}

const HttpFormSchema = z.object({
  endpoint: z.url({ message:'Enter a valid url' }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type FormDataType = z.infer<typeof HttpFormSchema>;

const HttpRequestDialog = ({ onOpenChange, open, initial, onSave }: Props) => {
  const form = useForm({
    resolver: zodResolver(HttpFormSchema),
    defaultValues: initial,
  });

  useEffect(() => {
    if (open) {
      form.reset(initial);
    }

    return () => {};
  }, [initial, form, open]);

  const handleSubmit = (values: FormDataType) => {
    onSave(values)
    onOpenChange(false)
  };

  const selectedMethod = form.watch("method");
  const enableBody = ["POST", "PUT", "PATCH"].includes(selectedMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>Http Request node</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              className="space-y-4 my-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger value={"Method"} className="w-full">
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
                    <FormDescription>
                      The method to use for this request
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint</FormLabel>
                    <Input
                      placeholder="https://example.com/users/{{httpResponse.data.id}}"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription>
                      {"Use {{variable}} to use the variables in request"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {enableBody && (
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body</FormLabel>
                      <Textarea
                        placeholder={
                          '{\n    "name":"{{httpResponse.data.name}}",\n    "userId":"{{httpResponse.data.userId}}",\n    "data":"{{httpResponse.data.data}"\n }'
                        }
                        value={field.value}
                        onChange={field.onChange}
                        className="min-h-[150px]"
                      />
                      <FormDescription>
                        {"Use {{variable}} to use the variables in request"}
                      </FormDescription>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HttpRequestDialog;
