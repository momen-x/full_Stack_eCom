"use client";
import DashboardLayout from "./_Components/Header/Header";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Please log in to view your profile
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className=" from-blue-500 to-purple-600 h-32 sm:h-40"></div>

          {/* Profile Content */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center -mt-16 sm:-mt-20">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={`${session.user?.name || "User"} photo`}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-gray-400">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mt-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {session.user?.name || "Anonymous User"}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {session.user?.email}
                </p>
              </div>

              {/* Stats or Additional Info */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-6 w-full max-w-md">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    0
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Orders
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    0
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Wishlist
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    0
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
