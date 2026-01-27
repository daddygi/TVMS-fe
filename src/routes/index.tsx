import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-traffic.jpeg')" }}
      >
        <div className="absolute inset-0 bg-[#1a3a5c]/85" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/lto-logo.jpeg"
            alt="LTO Logo"
            className="h-20 w-20 object-contain"
          />
        </div>

        {/* Title */}
        <div className="mt-4 text-center">
          <h1 className="text-xl font-bold tracking-tight text-[#1a3a5c] sm:text-2xl">
            TRAFFIC VIOLATION
            <br />
            MONITORING SYSTEM
          </h1>
          <p className="mt-1 text-sm text-gray-500">NCR OPERATIONS DIVISION</p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your username"
                className="pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember System
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-[#1a3a5c] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full cursor-pointer bg-[#1a3a5c] text-white hover:bg-[#152d47]"
          >
            Access Dashboard
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            <span className="font-semibold text-red-600">
              Restricted Access:
            </span>{" "}
            Authorized LTO Personnel Only.
          </p>
          <p className="mt-1">
            System Version 1.0 | &copy; {new Date().getFullYear()} Arellano
            University
          </p>
        </div>
      </div>
    </div>
  );
}
