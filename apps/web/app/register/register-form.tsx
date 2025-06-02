"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { RegisterFormSchema } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dob: new Date(),
      agreeToTerms: false,
    },
    mode: "onTouched",
  });
  const watchedValues = form.watch();
  const { errors, touchedFields } = form.formState;

  function getFieldStatus(fieldName: keyof z.infer<typeof RegisterFormSchema>) {
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
  async function handleSubmit(data: z.infer<typeof RegisterFormSchema>) {
    try {
      await apiClient.post("/auth/register", data);
    } catch {
      form.setError("root", {
        message: "An error occurred while registering. Please try again.",
      });
    }
  }
  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-4 w-full">
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(getFieldStyle(getFieldStatus("firstName")))}
                  />
                </FormControl>
                {errors["firstName"] && (
                  <p className="text-red-500 text-sm" role="alert">
                    <AlertCircleIcon className="inline mr-1 size-4" />
                    {errors["firstName"].message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(getFieldStyle(getFieldStatus("lastName")))}
                  />
                </FormControl>
                {errors["lastName"] && (
                  <p className="text-red-500 text-sm" role="alert">
                    <AlertCircleIcon className="inline mr-1 size-4" />
                    {errors["lastName"].message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={cn(getFieldStyle(getFieldStatus("email")))}
                  type="email"
                />
              </FormControl>
              {errors["email"] && (
                <p className="text-red-500 text-sm" role="alert">
                  <AlertCircleIcon className="inline mr-1 size-4" />
                  {errors["email"].message}
                </p>
              )}
            </FormItem>
          )}
        />
        {/* TODO: Add toggle for password visibility */}
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={cn(getFieldStyle(getFieldStatus("password")))}
                  type="password"
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
        {/* TODO: Use 3 fields for date of birth */}
        <FormField
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={cn(getFieldStyle(getFieldStatus("dob")))}
                  type="date"
                />
              </FormControl>
              {errors["dob"] && (
                <p className="text-red-500 text-sm" role="alert">
                  <AlertCircleIcon className="inline mr-1 size-4" />
                  {errors["dob"].message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-0.5 !my-2">
              <FormControl>
                <Checkbox
                  {...field}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                I agree to the
                <Link href="/tos" className="text-primary">
                  Terms of Service
                </Link>{" "}
                and
                <Link href="/privacy-policy" className="text-primary">
                  Privacy Policy
                </Link>
              </FormLabel>
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" size={"lg"}>
          Create Account
        </Button>
      </form>
      <p className="font-medium text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underscore">
          Signin
        </Link>
      </p>
    </Form>
  );
}
