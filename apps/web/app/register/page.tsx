import { CircleCheckBigIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import SocialImage from "@/assets/social.jpg";
import { RegisterForm } from "./register-form";
import { SocialSignupButtons } from "./social-signup-buttons";

export const metadata = {
  title: "Register",
  description: "Register to access the application",
};

export default function RegisterPage() {
  const features = [
    {
      title: "Connects with Friends",
      description: "Find old classmates and make new connections",
    },
    {
      title: "Share your Moments",
      description: "Post photos and update about your life",
    },
    {
      title: "Join Communities",
      description: "Find groups that match your interests",
    },
    {
      title: "Stay Updated",
      description: "Never miss important updates from friends",
    },
  ];
  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 overflow-auto items-center justify-center p-10">
      <div className="grid xl:grid-cols-2 w-full max-w-7xl mx-auto h-fit relative items-center gap-10">
        <div className="size-30 bg-sky-300/20 rounded-full left-[600px] absolute bottom-2" />
        <div className="size-10 bg-sky-300/20 rounded-full right-10 absolute top-72" />
        <div className="size-16 bg-indigo-400/60 rounded-full right-[540px] absolute top-16" />
        <div className="flex flex-start flex-col w-full p-6 border border-white/40 text-white rounded-md bg-gradient-to-br from-blue-300/40 to-indigo-300/40 backdrop-blur-lg h-fit">
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
                <h3 className="text-2xl font-semibold">Create your Profile</h3>
                <p className="text-lg">Share your moments with the world</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h5 className="text-xl font-semibold">
              Why join {process.env.NEXT_PUBLIC_APP_NAME}?
            </h5>
            <ul className="mt-2 space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CircleCheckBigIcon className="size-5 mt-1 text-green-300" />
                  <div>
                    <h6 className="font-medium">{feature.title}</h6>
                    <p className="text-sm text-gray-100">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-gray-400/30 border flex flex-col items-center gap-4 box-border justify-center">
          <div className="border border-border flex flex-col gap-4 p-10 items-center bg-white rounded-md w-full">
            <div className="flex items-center flex-col">
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-3 mb-2 text-white">
                <UsersIcon />
              </div>
              <h2 className="text-2xl font-semibold">Create Your Accont</h2>
              <p className="text-md">
                Join {process.env.NEXT_PUBLIC_APP_NAME} in just a few steps
              </p>
            </div>
            <SocialSignupButtons />
            <div className="flex items-center gap-2 text-gray-500 w-full">
              <span className="h-px w-full bg-gray-300" />
              <span>OR</span>
              <span className="h-px w-full bg-gray-300" />
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
