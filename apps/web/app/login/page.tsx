import SocialImage from "@/assets/social.jpg";
import Image from "next/image";
import {
  CameraIcon,
  GlobeIcon,
  HeartIcon,
  MessageCircleIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { SocialLoginButtons } from "./social-login-buttons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 overflow-auto items-center justify-center">
      <div className="grid lg:grid-cols-2 w-full max-w-7xl mx-auto h-fit relative items-center gap-4 p-10">
        <div className="size-30 bg-sky-300/20 rounded-full left-[600px] absolute bottom-2" />
        <div className="size-10 bg-sky-300/20 rounded-full right-10 absolute top-72" />
        <div className="size-16 bg-indigo-400/60 rounded-full right-[540px] absolute top-16" />
        <div className="flex flex-start flex-col w-full p-6 border border-white/40 text-white rounded-md bg-white/20 backdrop-blur-lg">
          <div className="relative">
            <Image
              src={SocialImage}
              width={800}
              alt="Social Image"
              className="w-full rounded-md object-cover h-64 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex flex-col p-6 pointer-events-none">
              <div className="flex-grow" />
              <div className="">
                <h3 className="text-2xl font-semibold">
                  Join million of users
                </h3>
                <p className="text-lg">Share your moments with the world</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col items-center justify-center p-6 border border-white/40 rounded-md bg-white/20 backdrop-blur-lg text-center">
              <CameraIcon className="text-yellow-200" size={40} />
              <h2 className="text-xl font-semibold mt-2">Share Moments</h2>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border border-white/40 rounded-md bg-white/20 backdrop-blur-lg text-center">
              <MessageCircleIcon className="text-green-200" size={40} />
              <h2 className="text-xl font-semibold mt-2">Chat with Friends</h2>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border border-white/40 rounded-md bg-white/20 backdrop-blur-lg text-center">
              <HeartIcon className="text-red-200" size={40} />
              <h2 className="text-xl font-semibold mt-2">Like & React</h2>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border border-white/40 rounded-md bg-white/20 backdrop-blur-lg text-center">
              <GlobeIcon className="text-sky-200" size={40} />
              <h2 className="text-xl font-semibold mt-2">Discover World</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 box-border justify-center w-full">
          <div className="border border-border flex flex-col gap-4 p-10 items-center bg-white rounded-md w-full">
            <div className="flex items-center flex-col">
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-3 mb-2 text-white">
                <UsersIcon />
              </div>
              <h2 className="text-2xl font-semibold">Welcome Back!</h2>
              <p className="text-md">Sign in to continue your journey</p>
            </div>
            <LoginForm />
            <div className="flex items-center gap-2 w-full">
              <span className="w-full h-px bg-border" />
              <div className="text-center text-gray-700 font-bold">OR</div>
              <span className="w-full h-px bg-border" />
            </div>
            <SocialLoginButtons />
            <div className="text-gray-600 inline-flex items-center gap-2 text-sm">
              <span>Don't have an account?</span>
              <Link href="/register" className="text-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
