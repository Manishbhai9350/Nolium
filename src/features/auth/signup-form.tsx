"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SignupSchema = z
  .object({
    name: z.string().min(4, "name should be atleast 2 characters"),
    email: z.email(),
    password: z.string().min(4, "Password should be atleast 4 characters"),
    confirmPassword: z.string(),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    error: "Password dont match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof SignupSchema>;

const SignupForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // chetah_meow_kehde_93

  const onSubmit = async (values: SignupValues) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/",
      },
      {
        onSuccess() {
          toast.success("Signed Up In Successfully");
          router.push("/");
        },
        onError(ctx) {
          toast.success(ctx.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Sign up to get started</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" placeholder="Fullname" {...field} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="Enter email" {...field} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="cursor-pointer w-full"
            >
              Signup
            </Button>
          </form>
        </Form>

        <p className="text-center text-slate-600">
          Already have an account ?{" "}
          <Link
            href="/login"
            className="hover:text-black underline underline-offset-4"
          >
            {" "}
            Login{" "}
          </Link>
        </p>

        <div className="my-2 relative flex justify-center items-center h-4">
          <Separator />
        </div>

        <Button
          disabled={isPending}
          variant="outline"
          className="cursor-pointer flex relative"
        >
          <Image width={20} height={20} src="/logos/google.svg" alt="Google" />
          Continue with Google
        </Button>
        <Button
          disabled={isPending}
          variant="outline"
          className="cursor-pointer flex relative"
        >
          <Image width={20} height={20} src="/logos/github.svg" alt="Github" />
          Continue with Github
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
