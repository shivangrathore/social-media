"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import GoogleIcon from "@/assets/icons/google.svg";
import MicrosoftIcon from "@/assets/icons/microsoft.svg";
import { useRouter } from "next/navigation";

export function SocialLoginButtons() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full gap-2">
      <button
        onClick={() =>
          router.push(
            `/api/v1/auth/provider/google?redirectUrl=${window.location.href}`,
          )
        }
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "lg",
          }),
          "border-red-500 text-red-500 hover:bg-transparent hover:text-red-600 hover:border-red-600",
        )}
      >
        <GoogleIcon />
        <span>Login with Google</span>
      </button>
      <button
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "lg",
          }),
          "border-blue-500 text-blue-500 hover:bg-transparent hover:text-blue-600 hover:border-blue-600",
        )}
      >
        <MicrosoftIcon />
        <span>Login with Microsoft</span>
      </button>
    </div>
  );
}
