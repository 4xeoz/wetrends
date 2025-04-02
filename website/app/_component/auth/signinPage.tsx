"use client";

import { CardFooter } from "@/components/ui/card";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { login } from "@/actions/auth";
import SignOutButton from "./signOutButton";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignInPage() {
  const session = useSession();
  const [errors, setErrors] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setErrors(null);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      // const result = await login(formData);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result) {
        setErrors("Invalid email or password");
        setIsPending(false);
        return;
      }
      if (result?.error) {
        setErrors(result.error);
        console.log("result.error", result.error);
      } else if (result?.ok) {
        // Successfully signed in
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error); // Add this for debugging
      setErrors("An error occurred during sign in");
    } finally {
      setIsPending(false);
    }

    //router.push("/me");
    setIsPending(false);
  }

  // async function handleGoogleSignIn() {
  //   await signIn("google");
  // }
  useEffect(() => {
    if (session.status === "authenticated") {
      console.log("session.status", session.status);
      router.refresh();
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-300">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl shadow-lg">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 relative bg-primary">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Login illustration"
            width={600}
            height={800}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="text-lg">We're glad to see you again!</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white">
          <Card className="border-0 shadow-none h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-primary">
                {isSignIn ? "Sign In" : "Sign Up"}
              </CardTitle>
              <CardDescription className="text-center">
                {isSignIn
                  ? "Enter your credentials to access your account"
                  : "Create a new account to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="border-input focus:ring-primary"
                  />
                  {errors?.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="border-input focus:ring-primary"
                  />
                  {errors?.password && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                {errors && typeof errors === "string" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isPending}
                >
                  {isPending
                    ? isSignIn
                      ? "Signing in..."
                      : "Signing up..."
                    : isSignIn
                    ? "Sign in"
                    : "Sign up"}
                </Button>
              </form>

              {session.data?.user?.email && (
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-sm font-medium">Signed in as:</p>
                  <p className="font-bold">{session.data.user.email}</p>
                </div>
              )}

              <div className="relative my-4">
                <Separator className=" bg-muted-foreground" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className=" bg-white px-2 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              {/* <Button
                variant="outline"
                className="w-full border-input bg-slate-300 hover:bg-muted"
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </Button> */}

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  {isSignIn
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    className="ml-1 text-primary hover:text-primary/80 font-medium"
                    onClick={() => setIsSignIn(!isSignIn)}
                  >
                    {isSignIn ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <SignOutButton className={""} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
