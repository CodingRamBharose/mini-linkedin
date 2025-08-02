"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const response = await axios.post("/api/sign-up", data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Sign Up Failed",
        description: axiosError.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-2 sm:p-4 dark:bg-gray-900">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Create an account</h1>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
            Enter your details to get started
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <GoogleSignInButton width = {100} />
        </Suspense>

        <div className="flex items-center gap-2">
          <Separator className="flex-1 dark:bg-gray-600" />
          <span className="text-sm text-muted-foreground dark:text-gray-400">OR</span>
          <Separator className="flex-1 dark:bg-gray-600" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base dark:text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="h-10 sm:h-11 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      className="h-10 sm:h-11 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  <FormLabel className="text-sm sm:text-base dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="h-10 sm:h-11 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base">
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline dark:text-primary-400">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}