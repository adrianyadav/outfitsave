"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsLoading(true);
      setError(null);

      const formData = new FormData(event.currentTarget);
      const { name, email, password } = Object.fromEntries(formData);

      // First, create the user
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        setError(errorData.error || "Registration failed");
        return;
      }

      // Then, sign in the user
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Failed to sign in after registration");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setError("Google sign-in failed");
        return;
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("An error occurred during Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-grey)] text-white py-12 px-4 sm:px-6 lg:px-8 font-[var(--font-f-lausanne-400)]">
      <div className="max-w-md w-full p-8 border border-white/10 bg-white/5 relative overflow-hidden group">
        <div className="space-y-4 mb-8 text-center relative z-10">
          <h1 className="text-3xl font-[var(--font-f-lausanne-300)]">Create account</h1>
          <p className="text-sm text-[var(--color-white-06)]">
            Enter your details to create a new account
          </p>
        </div>
        
        <div className="relative z-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                data-testid="name-input"
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                data-testid="email-input"
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                data-testid="password-input"
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white h-12"
              />
            </div>

            {error ? (
              <div className="text-red-400 text-sm text-center" data-testid="error-message">{error}</div>
            ) : null}

            <button 
                type="submit" 
                className="w-full h-12 bg-white text-black font-medium hover:bg-[var(--color-white-08)] transition-colors disabled:opacity-50 mt-4" 
                disabled={isLoading} 
                data-testid="submit-button"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-[#111] px-4 text-[var(--color-white-06)]">Or</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            className="w-full h-12 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center justify-center font-medium"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            data-testid="google-signin-button"
          >
            <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? "Signing in..." : "Google"}
          </button>

          <div className="text-center mt-8">
            <Link href="/login" className="text-sm text-[var(--color-white-06)] hover:text-white transition-colors" data-testid="login-link">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
