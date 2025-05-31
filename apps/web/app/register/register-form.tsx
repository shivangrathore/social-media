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
import { RegisterFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
  });
  return (
    <Form {...form}>
      <form className="space-y-4 w-full">
        <div className="flex gap-4 w-full">
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                <Input {...field} type="email" />
              </FormControl>
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
                <Input {...field} type="password" />
              </FormControl>
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
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-0.5 !my-2">
              <FormControl>
                <Checkbox {...field} />
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
