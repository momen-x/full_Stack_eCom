// app/user-data/page.tsx
import UserTable from "@/app/_Components/Admin/UserTable";
import { IUser } from "@/app/server/getUserData";
import domain from "@/app/utils/domain";

export const dynamic = "force-dynamic";

const UserDataPage = async () => {
  let users: IUser[] = [];

  try {
    const response = await fetch(`${domain}/api/users`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      users = data.users || [];
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">
          Manage user accounts and admin permissions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <UserTable initialUsers={users} />
      </div>
    </div>
  );
};

export default UserDataPage;
