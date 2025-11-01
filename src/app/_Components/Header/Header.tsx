"use client";
import {
  HomeIcon,
  LogOut,
  StoreIcon,
  Settings,
  ListPlus,
  Package,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NavButton from "@/components/NavButton";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pages = [
    { icon: HomeIcon, label: "Dashboard", path: "/" },
    { icon: ListPlus, label: "Orders", path: "/orders" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Settings, label: "Setting", path: "/setting" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`
          border-r
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isSidebarOpen ? "w-64" : "w-20"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between cursor-pointer">
          <Link href={"/"}>
            {isSidebarOpen && (
              <div className="flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                  <StoreIcon className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold">our eCom</span>
              </div>
            )}
            {!isSidebarOpen && (
              <div className="flex justify-center w-full">
                <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                  <StoreIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {pages.map((page) => (
            <NavButton
              key={page.path}
              icon={page.icon}
              label={page.label}
              path={page.path}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-4">
          <div
            className={`flex ${
              isSidebarOpen ? "justify-between" : "justify-center"
            }`}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">welcome Admin</span>
              <ModeToggle />
              <Button
              style={{ cursor:"pointer" }}
                variant="ghost"
                size="icon"
                aria-label="logOut"
                title="logOut"
                className="rounded-full"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content - This is where children go */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
