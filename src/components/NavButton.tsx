// components/NavButton.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  variant?: "sidebar" | "header" | "mobile";
  isSidebarOpen?: boolean;
  exact?: boolean;
  showTooltip?: boolean;
  onClick?: () => void;
}

const NavButton = ({
  icon: Icon,
  label,
  path,
  variant = "sidebar",
  isSidebarOpen = true,
  exact = false,
  showTooltip = false,
  onClick,
}: NavButtonProps) => {
  const pathname = usePathname();

  // Determine if active based on exact prop
  const isActive = exact
    ? pathname === path
    : pathname === path || pathname.startsWith(`${path}/`);

  // Variant-specific configurations
  const variantConfig = {
    sidebar: {
      className: "w-full justify-start",
      iconClass: isSidebarOpen ? "mr-3" : "mr-0",
      showLabel: isSidebarOpen,
      size: "sm" as const,
    },
    header: {
      className: "flex-col h-auto px-3 py-2",
      iconClass: "mr-0 mb-1",
      showLabel: true,
      size: "sm" as const,
    },
    mobile: {
      className: "flex-col flex-1 h-auto px-2 py-2 min-w-[60px]",
      iconClass: "mr-0 mb-1",
      showLabel: true,
      size: "sm" as const,
    },
  };

  const config = variantConfig[variant];

  const buttonContent = (
    <>
      <Icon className={cn("h-4 w-4 flex-shrink-0", config.iconClass)} />
      {config.showLabel && (
        <span
          className={cn(
            "whitespace-nowrap",
            variant === "header" || variant === "mobile" ? "text-xs" : "text-sm"
          )}
        >
          {label}
        </span>
      )}
    </>
  );

  const buttonClasses = cn(
    "transition-all duration-200 relative",
    config.className,
    isActive
      ? "bg-accent text-accent-foreground font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
    // Different hover effects based on variant
    variant === "sidebar" && "rounded-lg",
    variant === "header" && "rounded-md hover:bg-accent/30",
    variant === "mobile" && "rounded-md text-xs"
  );

  // If onClick is provided, use button, otherwise use Link
  if (onClick) {
    return (
      <Button
        variant="ghost"
        size={config.size}
        className={buttonClasses}
        onClick={onClick}
        title={!config.showLabel ? label : undefined}
      >
        {buttonContent}

        {/* Active indicator for header/mobile variants */}
        {(variant === "header" || variant === "mobile") && isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={config.size}
      className={buttonClasses}
      asChild
      title={!config.showLabel ? label : undefined}
    >
      <Link href={path}>
        {buttonContent}

        {/* Active indicator for header/mobile variants */}
        {(variant === "header" || variant === "mobile") && isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Link>
    </Button>
  );
};

export default NavButton;
