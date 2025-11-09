"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    console.log("Auth error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-4">
          {error === "Configuration"
            ? "There is a problem with the server configuration. Please check your environment variables and Google OAuth settings."
            : `Error: ${error}`}
        </p>
        <a href="/auth/signin" className="text-blue-600 hover:underline">
          Return to Sign In
        </a>
      </div>
    </div>
  );
}
