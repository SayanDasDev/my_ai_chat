"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { useTokenStore } from "@/hooks/use-token-store";
import { queryKeyStore } from "@/lib/query-key-store";
import { authQuery } from "@/queries/auth-queries";
import { loginSchema } from "@/types/schema/login-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { logIn } = authQuery();
  const { setAccessToken, setRefreshToken } = useTokenStore();

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: [queryKeyStore.logIn],
    mutationFn: logIn,
    onMutate: () => {
      const toastId = toast.loading("Looking for User");
      return { toastId };
    },
    onError: (error, variables, context) => {
      toast.error("Please make sure to enter correct credentials.", {
        id: context?.toastId,
      });
    },
    onSuccess: (data, variables, context) => {
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      router.push("/chat");
      // console.log(data);
      toast.success("Welcome back!", {
        id: context?.toastId,
      });
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="sayandas@myaichat.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="sayandas@myaichat.com"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                isLoading={isPending}
                type="submit"
                className="w-full"
              >
                Login
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-sm">
            Dont&apos; have an account?{" "}
            <a href="/register" className="underline underline-offset-4">
              Register
            </a>
          </div>
        </CardFooter>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
