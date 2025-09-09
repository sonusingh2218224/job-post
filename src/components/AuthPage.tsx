"use client";

import AuthForm from "./forms/RegisterForm";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  return (
    <div className=" min-h-screen grid grid-cols-1 lg:grid-cols-2 ">
      <div
        className="hidden lg:flex flex-col   text-white"
        style={{
          backgroundImage: "url('/assets/auth/bg-login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-md mx-auto text-center  pt-12">
          <h1 className="text-3xl md:text-[42px] font-bold mb-4">
            Welcome to{" "}
            <span className="text-yellow-300 !font-inter">Artizence</span>
          </h1>
          <p className="text-lg opacity-90 ">
            Build your career and grow your company with us.
            {mode === "login"
              ? " Sign in to continue."
              : " Create your account and get started today."}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center  ">
        <div className="w-full">
          <AuthForm mode={mode} />
        </div>
      </div>
    </div>
  );
}
