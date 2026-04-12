"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  BarChart3,
  FilePen,
  Globe,
  Sparkles,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { NewApplicationDialog } from "./new-application-dialog";

interface DashboardShellProps {
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/resume", label: "Resume Forge", icon: FilePen },
  { href: "/jobs", label: "Job Market", icon: Globe },
  { href: "/concierge", label: "AI Concierge", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link key={item.label} href={item.href} onClick={onNavigate}>
            <button
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200"
              style={{
                background: isActive ? "rgba(0,113,227,0.08)" : "transparent",
                color: isActive ? "#0071e3" : "#6e6e73",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f5f5f7";
                  e.currentTarget.style.color = "#1d1d1f";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6e6e73";
                }
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <Link
      href="/"
      className="flex h-16 items-center gap-2.5 px-6 transition-opacity hover:opacity-70"
    >
      <div
        className="flex h-6 w-6 items-center justify-center rounded-md"
        style={{ background: "#0071e3" }}
      >
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{ background: "#ffffff", transform: "rotate(45deg)" }}
        />
      </div>
      <span className="text-[15px] font-semibold" style={{ color: "#1d1d1f" }}>
        CareerOS
      </span>
    </Link>
  );
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      {/* Soft Apple backdrop orbs */}
      <div className="apple-backdrop" />

      {/* Desktop Sidebar */}
      <aside
        className="relative z-10 hidden w-64 flex-col md:flex"
        style={{
          background: "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <BrandMark />
        <div
          className="mx-4 h-px"
          style={{ background: "rgba(0,0,0,0.06)" }}
        />

        <div className="flex-1 py-4">
          <SidebarNav />
        </div>

        <div
          className="mx-4 h-px"
          style={{ background: "rgba(0,0,0,0.06)" }}
        />

        <div className="p-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar
              className="h-8 w-8"
              style={{ border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback
                style={{
                  background: "#f5f5f7",
                  color: "#6e6e73",
                  fontSize: 12,
                }}
              >
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p
                className="truncate text-sm font-medium"
                style={{ color: "#1d1d1f" }}
              >
                {user.fullName}
              </p>
              <p
                className="truncate text-xs"
                style={{ color: "#86868b" }}
              >
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex h-16 items-center gap-4 px-4 md:px-8"
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
          }}
        >
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                style={{ color: "#6e6e73" }}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0"
              style={{
                background: "#ffffff",
                borderRight: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <SheetHeader className="px-6 py-4">
                <SheetTitle
                  className="flex items-center gap-2.5 text-left"
                  style={{ color: "#1d1d1f" }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{ background: "#0071e3" }}
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{
                        background: "#ffffff",
                        transform: "rotate(45deg)",
                      }}
                    />
                  </div>
                  <span className="text-[15px] font-semibold">CareerOS</span>
                </SheetTitle>
              </SheetHeader>
              <div
                className="h-px"
                style={{ background: "rgba(0,0,0,0.06)" }}
              />
              <div className="py-4">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* Quick-add */}
          <button
            onClick={() => setQuickAddOpen(true)}
            title="Log new application"
            className="flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors"
            style={{
              background: "#0071e3",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0077ed")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0071e3")}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Application</span>
          </button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-2"
                style={{ color: "#1d1d1f" }}
              >
                <Avatar
                  className="h-7 w-7"
                  style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <AvatarImage src={user.avatarUrl ?? undefined} />
                  <AvatarFallback
                    style={{
                      background: "#f5f5f7",
                      color: "#6e6e73",
                      fontSize: 11,
                    }}
                  >
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm md:inline-block">
                  {user.fullName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>
                  {user.fullName}
                </p>
                <p className="text-xs" style={{ color: "#86868b" }}>
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator
                style={{ background: "rgba(0,0,0,0.06)" }}
              />
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex items-center"
                  style={{ color: "#6e6e73" }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                style={{ background: "rgba(0,0,0,0.06)" }}
              />
              <DropdownMenuItem
                onClick={handleSignOut}
                style={{ color: "#6e6e73" }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10">{children}</main>
      </div>

      <NewApplicationDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </div>
  );
}
