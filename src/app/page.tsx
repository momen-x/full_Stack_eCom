"use client";
import DashboardLayout from "./_Components/Admin/Header";
import { useSession } from "next-auth/react";
import MainPage from "./_Components/MainPage";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Please log in to view your profile
        </p>
      </div>
    );
  }
  if (session?.user?.isAdmin) {
    return (
      <DashboardLayout>
        <span>Welcome Admin</span>
        <MainPage />
      </DashboardLayout>
    );
  }
  return (
    <div>
      <MainPage />
      {/* {session.user?.name} */}
    </div>
  );
}
