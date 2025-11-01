// components/NavButton.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSidebarOpen?: boolean;
  exact?: boolean; // Optional: if true, only exact matches are active
}

const NavButton = ({
  icon: Icon,
  label,
  path,
  isSidebarOpen,
  exact = false, // Default to false (match children too)
}: NavButtonProps) => {
  const pathname = usePathname();
  
  // Determine if active based on exact prop
  const isActive = exact 
    ? pathname === path // Exact match only
    : pathname === path || pathname.startsWith(`${path}/`); // Match path and children

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full justify-start transition-colors ${
        isSidebarOpen ? "px-3" : "px-2 justify-center"
      } 
        ${isActive ? "bg-accent" : ""}
      `}
      asChild
    >
      <Link href={path}>
        <Icon className={`${isSidebarOpen ? "mr-3" : "mr-0"} h-4 w-4`} />
        {isSidebarOpen && label}
      </Link>
    </Button>
  );
};

export default NavButton;