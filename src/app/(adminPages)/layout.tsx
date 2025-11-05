import { auth } from "@/auth";
import AdminDashbord from "../_Components/Admin/Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("Access denied. Admin only.");
    // return <div>Access denied. Admin only.</div>;
  }

  return (
    <div>
      <AdminDashbord>{children}</AdminDashbord>
    </div>
  );
}
