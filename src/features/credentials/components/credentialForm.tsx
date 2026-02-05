"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CredentialTypes } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/useCredentials";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  initialData?: {
    id?: string;
    type: CredentialTypes;
    name: string;
    value: string;
  };
}

const credentialSelectOptions = [
  {
    type: CredentialTypes.ANTHROPIC,
    label: "Anthropic (Claude)",
    logo: "/logos/anthropic.svg",
  },
  {
    type: CredentialTypes.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini.svg",
  },
  {
    type: CredentialTypes.GPT,
    label: "GPT (Open AI)",
    logo: "/logos/openai.svg",
  },
];

const credentialFormSchema = z.object({
  type: z.enum(CredentialTypes),
  name: z.string(),
  value: z.string(),
});

type credentialFormType = z.infer<typeof credentialFormSchema>;

const CredentialForm = ({ initialData }: Props) => {
  const router = useRouter();

  const credentialId = initialData?.id;
  const isUpdate = !!credentialId;

  const form = useForm<credentialFormType>({
    defaultValues: initialData || {
      name: "",
      type: "GPT",
      value: "",
    },
    resolver: zodResolver(credentialFormSchema),
  });

  const create = useCreateCredential();
  const update = useUpdateCredential();

  const OnSubmit = (values: credentialFormType) => {
    if (isUpdate) {
      update.mutate(
        {
          ...values,
          id: credentialId,
        },
        {
          onSuccess(data) {
            toast.success(`Credential ${data.name} updated successfully`);
            router.push(`/credentials/${data.id}`);
          },
          onError(error) {
            toast.error(`Failed to update credential`);
          },
        },
      );
    } else {
      create.mutate(values, {
        onSuccess(data) {
          toast.success(`Credential ${data.name} created successfully`);
          router.push(`/credentials/${data.id}`);
        },
        onError(error) {
          toast.error(`Failed to create credential`);
        },
      });
    }
  };

  return (
    <Card className="min-w-sm">
      <CardHeader>
        <CardTitle>
          {isUpdate ? "Create Credential" : "Update Credential"}
        </CardTitle>
        <CardDescription>
          {isUpdate ? "Update your credential" : "Create a new credential"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="My GPT Key" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full" {...field}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentialSelectOptions.map((option) => (
                        <SelectItem key={option.type} value={option.type}>
                          <div className="flex items-center gap-4">
                            <Image
                              src={option.logo}
                              width={16}
                              height={16}
                              alt={option.label}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Api Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="mykyi-...."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <Button type="button" disabled={create.isPending || update.isPending} className="flex-1">
                {isUpdate ? "Update" : "Create"}
              </Button>
              <Button type="button" className="flex-1" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CredentialForm;
