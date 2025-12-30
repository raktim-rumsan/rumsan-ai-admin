"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignUpMutation } from "@/queries/loginQuery";

export default function AuthSignUp() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signUpMutation = useSignUpMutation();

  const validateEmail = (
    emailValue: string,
    checkFormat: boolean = false
  ): boolean => {
    if (!emailValue.trim()) {
      setEmailError("Email is required");
      return false;
    }
    // Check if email contains only allowed characters: a-z, 0-9, ., and @
    const allowedCharsRegex = /^[a-z0-9.@]+$/i;
    if (!allowedCharsRegex.test(emailValue)) {
      setEmailError(
        "Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed"
      );
      return false;
    }
    // Check for multiple @ symbols
    const atSymbolCount = (emailValue.match(/@/g) || []).length;
    if (atSymbolCount > 1) {
      setEmailError("Email can only contain one @ symbol");
      return false;
    }
    // Only validate email format on blur or submit
    if (checkFormat) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        setEmailError("Please enter a valid email address");
        return false;
      }
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Only check for invalid characters while typing, not email format
    if (value.trim()) {
      const allowedCharsRegex = /^[a-z0-9.@]+$/i;
      if (!allowedCharsRegex.test(value)) {
        setEmailError(
          "Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed"
        );
      } else {
        // Check for multiple @ symbols
        const atSymbolCount = (value.match(/@/g) || []).length;
        if (atSymbolCount > 1) {
          setEmailError("Email can only contain one @ symbol");
        } else {
          setEmailError("");
        }
      }
    } else {
      setEmailError("");
    }
  };

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Full name is required");
      return false;
    }
    // Only allow letters and spaces
    const lettersOnlyRegex = /^[a-zA-Z\s]+$/;
    if (!lettersOnlyRegex.test(value)) {
      setNameError(
        "Only letters are allowed. Numbers and special characters are not permitted."
      );
      return false;
    }
    setNameError("");
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim()) {
      const lettersOnlyRegex = /^[a-zA-Z\s]+$/;
      if (!lettersOnlyRegex.test(value)) {
        setNameError(
          "Only letters are allowed. Numbers and special characters are not permitted."
        );
      } else {
        setNameError("");
      }
    } else {
      setNameError("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateName(name) || !validateEmail(email, true)) {
      setIsLoading(false);
      return;
    }

    try {
      await signUpMutation.mutateAsync({
        fullName: name,
        email,
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Rumsan AI</h1>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
            <CardDescription className="text-gray-600">
              Create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => validateName(name)}
                  className={`h-11 ${nameError ? "border-red-500" : ""}`}
                />
                {nameError && (
                  <p className="text-sm text-red-500">{nameError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email, true)}
                  className={`h-11 ${emailError ? "border-red-500" : ""}`}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-gray-800"
                disabled={isLoading || !!nameError || !!emailError}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-black hover:underline"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
