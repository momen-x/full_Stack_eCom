import AdminDashbord from "../_Components/Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminDashbord>{children}</AdminDashbord>
    </div>
  );
}
