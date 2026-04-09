"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  BarChart3,
  FileText,
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
import { HlsVideoBg } from "@/components/hls-video-bg";

interface DashboardShellProps {
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard", label: "Applications", icon: FileText },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard", label: "Settings", icon: Settings },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href}>
          <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white/80">
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-black">
      {/* Atmospheric video background */}
      <HlsVideoBg
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
        fallbackSrc="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
      />

      {/* Desktop Sidebar — liquid glass */}
      <aside className="liquid-glass relative z-10 hidden w-64 flex-col md:flex">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Briefcase className="h-4 w-4 text-white/80" />
          </div>
          <span className="font-serif text-lg italic text-white/90">
            Tracker
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* Navigation */}
        <div className="flex-1 py-4">
          <SidebarNav />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-white/5 text-xs text-white/60">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-white/80">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-white/30">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-16 items-center gap-4 border-b border-white/[0.06] px-4 md:px-8">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/50 hover:text-white md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 border-white/[0.06] bg-black/95 p-0 backdrop-blur-xl"
            >
              <SheetHeader className="px-6 py-4">
                <SheetTitle className="flex items-center gap-3 text-left text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Briefcase className="h-4 w-4 text-white/80" />
                  </div>
                  <span className="font-serif italic">Tracker</span>
                </SheetTitle>
              </SheetHeader>
              <div className="h-px bg-white/[0.06]" />
              <div className="py-4">
                <SidebarNav />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-2 text-white/60 hover:text-white"
              >
                <Avatar className="h-7 w-7 border border-white/10">
                  <AvatarImage src={user.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-white/5 text-xs text-white/50">
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
              className="w-56 border-white/[0.08] bg-black/90 backdrop-blur-xl"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white/90">
                  {user.fullName}
                </p>
                <p className="text-xs text-white/40">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem className="text-white/60 focus:bg-white/[0.04] focus:text-white/80">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-white/60 focus:bg-white/[0.04] focus:text-white/80"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
