/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ChartBarStacked,
  HomeIcon,
  // LogOut,
  Package,
  ChevronDown,
  ShoppingBag,
  Loader2,
  AlertTriangle,
  LogOut,
  BookHeart,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/app/store/hook";
import logo from "@/app/Logo.ico";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
const pages = [
  { icon: HomeIcon, label: "Home", path: "/" },
  { icon: ChartBarStacked, label: "Category", path: "/category" },
  { icon: Package, label: "Products", path: "/products" },
];

const UserHeader = () => {
  const { data: session } = useSession();
  const { totalQuantity } = useAppSelector((state) => state.carts);
  const { totalWishListQuantity } = useAppSelector((state) => state.wishlist);
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogOut, setIsLogOut] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(`/user${path}`);
  };

  const handleLogOut = async () => {
    setIsLogOut(true);
    try {
      if (totalQuantity > 0) {
        localStorage.removeItem("persist:root");
      }
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLogOut(false);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (isUserMenuOpen) {
      setIsDialogOpen(false);
    }
  }, [isUserMenuOpen]);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
      {/* Confirm Log Out Dialog - Move this OUTSIDE the user menu */}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="fixed left-[50%] top-[500%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-semibold">
                  Confirm Log Out
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                  {totalQuantity > 0
                    ? "You have items in your cart. Logging out will clear your cart data."
                    : "Are you sure you want to log out?"}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel
              disabled={isLogOut}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogOut}
              disabled={isLogOut}
              className="bg-destructive text-destructive-foreground rounded-2xl p-2 w-fit"
            >
              {isLogOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Logging out...
                </>
              ) : (
                <div className="flex gap-2">
                  <LogOut className="w-6" />
                  <p>Log Out</p>
                </div>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo.src}
                alt="logo"
                className="h-9 w-9 text-primary transition-transform group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              eCom
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {pages.map((page) => {
              const pagePath = page.path !== "/" ? `/user${page.path}` : "/";
              const active = isActive(page.path);
              const Icon = page.icon;

              return (
                <button
                  key={page.path}
                  onClick={() => router.push(pagePath)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{page.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart with Badge */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/user/cart")}
            className="relative hover:bg-accent rounded-full h-10 w-10"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalQuantity > 0 && (
              <div className="absolute -top-1 -right-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-pink-600 text-white text-xs font-bold shadow-lg ring-2 ring-background">
                  {totalQuantity}
                </div>
              </div>
            )}
          </Button>
          {/* wishlist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/user/wishlist")}
            className="relative hover:bg-accent rounded-full h-10 w-10"
          >
            <BookHeart className="h-5 w-5" />
            {mounted && totalWishListQuantity > 0 && (
              <div className="absolute -top-1 -right-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-pink-600 text-white text-xs font-bold shadow-lg ring-2 ring-background">
                  {totalWishListQuantity}
                </div>
              </div>
            )}
          </Button>
          <ModeToggle />

          {session?.user ? (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-full pl-2 pr-3 h-10 transition-all duration-200",
                  isUserMenuOpen && "bg-accent"
                )}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold ring-2 ring-background">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                  {session.user.name}
                </span>

                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isUserMenuOpen && "rotate-180"
                  )}
                />
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border bg-popover shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-primary-foreground text-lg font-bold ring-2 ring-background shadow-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (totalQuantity > 0) {
                          setIsDialogOpen(true);
                        } else {
                          handleLogOut();
                        }
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={isLogOut}
                    >
                      {isLogOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => signIn("google")}
                className="rounded-full px-6 h-10 font-medium shadow-sm hover:shadow-md transition-all"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex border-t md:hidden bg-background">
        {pages.map((page) => {
          const pagePath = page.path !== "/" ? `/user${page.path}` : "/";
          const active = isActive(page.path);
          const Icon = page.icon;

          return (
            <button
              key={page.path}
              onClick={() => router.push(pagePath)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors relative",
                active
                  ? "text-primary"
                  : "text-muted-foreground active:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{page.label}</span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default UserHeader;
