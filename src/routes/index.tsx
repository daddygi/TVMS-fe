import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/api";
import { AxiosError } from "axios";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

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
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white px-8 py-10 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/lto-logo.jpeg"
            alt="LTO Logo"
            className="h-20 w-20 object-contain"
          />
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h1 className="text-xl font-bold tracking-tight text-[#1a3a5c] sm:text-2xl">
            TRAFFIC VIOLATION
            <br />
            MONITORING SYSTEM
          </h1>
          <p className="mt-2 text-sm text-gray-500">NCR OPERATIONS DIVISION</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
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
              <Checkbox id="remember" disabled={isLoading} />
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
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
