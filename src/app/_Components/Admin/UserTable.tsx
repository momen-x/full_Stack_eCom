"use client";

import { IUser } from "@/app/server/getUserData";
import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertShowHide } from "@/app/Context/SnackBar";
import { useSession } from "next-auth/react";

interface UserTableProps {
  initialUsers: IUser[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { showAlert } = useAlertShowHide();
  const { data: session, update: updateSession } = useSession();

  const handleToggleAdmin = async (userId: string, newAdminStatus: boolean) => {
    setLoading(userId);
    try {
      const response = await fetch(`${domin}/api/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isAdmin: newAdminStatus,
          process: "editIsAdmin",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isAdmin: newAdminStatus } : user
          )
        );

        // If updating self, force session update
        if (data.isSelf) {
          await updateSession(); // Force NextAuth to refetch session
        }

        // Refresh the page to update session/cache
        router.refresh();

        showAlert(
          newAdminStatus
            ? "Admin privileges granted successfully"
            : "Admin privileges removed successfully",
          "success"
        );
      } else {
        console.error("Failed to update admin status:", data.error);
        showAlert(data.error || "Failed to update admin status", "destructive");

        // Revert UI state on error
        setUsers(initialUsers);
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
      showAlert("Network error - please try again", "destructive");

      // Revert UI state on error
      setUsers(initialUsers);
    } finally {
      setLoading(null);
    }
  };

  // Check if current user can modify this user
  // const canModifyUser = (userId: string) => {
  //   return session?.user?.id !== userId;
  // };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Admin Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => {
            const isAdmin = user.isAdmin;
            const isSelf = session?.user?.id === user._id;

            return (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </div>
                    {isSelf && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      isAdmin
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!isAdmin ? (
                    <Button
                      onClick={() => handleToggleAdmin(user._id, true)}
                      disabled={loading === user._id}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading === user._id ? "Adding..." : "Add Admin"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleToggleAdmin(user._id, false)}
                      disabled={loading === user._id || isSelf}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        isSelf ? "You cannot remove your own admin status" : ""
                      }
                    >
                      {loading === user._id ? "Removing..." : "Remove Admin"}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
}
