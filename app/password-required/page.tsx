"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IoShield } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorExiting, setIsErrorExiting] = useState(false);

  const shortCode = searchParams.get("shortCode");
  const clickId = searchParams.get("clickId");
  const hasError = searchParams.get("error") === "invalid";

  const dismissError = () => {
    setIsErrorExiting(true)
    setTimeout(() => {
      setError(null)
      setIsErrorExiting(false)
    }, 300)
  }

  useEffect(() => {
    if (!shortCode) {
      router.push("/not-found");
    }
  }, [shortCode, router]);

  useEffect(() => {
    if (hasError) {
      setError("Incorrect password. Please try again.");
      setTimeout(dismissError, 5000);
    }
  }, [hasError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter a password");
      setTimeout(dismissError, 5000);
      return;
    }

    setLoading(true);
    setError(null);

    // Use server-side form submission instead of client-side redirect
    // This is more reliable on mobile browsers
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = `/${shortCode}`;
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = password;
    form.appendChild(passwordInput);
    
    if (clickId) {
      const clickIdInput = document.createElement('input');
      clickIdInput.type = 'hidden';
      clickIdInput.name = 'clickId';
      clickIdInput.value = clickId;
      form.appendChild(clickIdInput);
    }
    
    document.body.appendChild(form);
    form.submit();
  };

  if (!shortCode) {
    return null; // Will redirect to not-found
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-4"
            size="sm"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoShield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Password Required</CardTitle>
            <p className="text-muted-foreground text-sm">
              This short URL is password protected. Please enter the password to continue.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert 
                variant="destructive" 
                className={`mb-4 transition-all duration-300 ${
                  isErrorExiting 
                    ? 'animate-out fade-out slide-out-to-top-2' 
                    : 'animate-in fade-in slide-in-from-top-2'
                }`}
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter password"
                  className="text-center"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground">
                Short URL: <span className="font-mono">/{shortCode}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PasswordRequiredPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={
        <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }>
        <PasswordForm />
      </Suspense>
    </div>
  );
} 