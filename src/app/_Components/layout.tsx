"use client";
import { useSession, signIn } from "next-auth/react";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-full text-center">
          <button
            className="bg-white px-4 py-2 rounded-lg text-black hover:bg-gray-100 transition-colors"
            onClick={() => signIn("google")}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen w-full">{children}</div>;
}
