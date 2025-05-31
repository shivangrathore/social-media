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
import { loadUser } from "@/lib/store/auth";
import { LoginFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { id: "", password: "" },
  });

  async function handleSubmit(data: z.infer<typeof LoginFormSchema>) {
    await apiClient.post("/auth/login", data);
    loadUser();
  }
  return (
    <Form {...form}>
      <form
        className="flex p-4 flex-col space-y-2 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button>Login</Button>
      </form>
    </Form>
  );
}
