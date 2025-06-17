"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { loadUser } from "@/store/auth";
import { LoginFormSchema } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function LoginForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { id: "", password: "" },
    mode: "onTouched",
  });

  const watchedValues = form.watch();
  const { errors, touchedFields } = form.formState;

  function getFieldStatus(fieldName: keyof z.infer<typeof LoginFormSchema>) {
    const hasError = errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasValue = watchedValues[fieldName];

    if (hasError && isTouched) {
      return "error";
    }
    if (!hasError && isTouched && hasValue) {
      return "success";
    }
    return "default";
  }

  function getFieldStyle(state: "error" | "success" | "default") {
    switch (state) {
      case "error":
        return "border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500";
      case "success":
        return "border-green-500 focus-visible:ring-green-500/20 focus-visible:border-green-500";
      default:
        return "";
    }
  }

  async function handleSubmit(data: z.infer<typeof LoginFormSchema>) {
    await apiClient.post("/auth/login", data);
    await loadUser();
    const next = new URLSearchParams(window.location.search).get("next") || "/";
    router.push(next);
  }

  return (
    <Form {...form}>
      <form
        className="flex p-4 flex-col space-y-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={cn(getFieldStyle(getFieldStatus("id")))}
                />
              </FormControl>
              {errors["id"] && (
                <p className="text-red-500 text-sm" role="alert">
                  <AlertCircleIcon className="inline mr-1 size-4" />
                  {errors["id"].message}
                </p>
              )}
            </FormItem>
          )}
        />
        {/* TODO: Add toggle for password visibility */}
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={cn(getFieldStyle(getFieldStatus("password")))}
                />
              </FormControl>
              {errors["password"] && (
                <p className="text-red-500 text-sm" role="alert">
                  <AlertCircleIcon className="inline mr-1 size-4" />
                  {errors["password"].message}
                </p>
              )}
            </FormItem>
          )}
        />
        <Button>Login</Button>
      </form>
    </Form>
  );
}
