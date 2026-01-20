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

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password should be atleast 4 characters"),
});

type LoginValues = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess() {
          toast.success("Logged In Successfully");
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
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Login to continue</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
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
                    <Input type="password" placeholder="**********" {...field} />
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
              Login
            </Button>
          </form>
        </Form>

        <p className="text-center text-slate-600">
          Don&apos; have an account ?{" "}
          <Link
            href="/signup"
            className="hover:text-black underline underline-offset-4"
          >
            {" "}
            Singup{" "}
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
        <Image width={20} height={20} src='/logos/google.svg' alt="Google" />
          Continue with Google
        </Button>
        <Button
          disabled={isPending}
          variant="outline"
          className="cursor-pointer flex relative"
        >
        <Image width={20} height={20} src='/logos/github.svg' alt="Github" />
          Continue with Github
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
