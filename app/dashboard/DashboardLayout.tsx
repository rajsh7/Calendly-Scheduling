"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  BookMarked,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Bell,
  User,
} from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Event Types", href: "/dashboard/events", icon: CalendarDays },
    { label: "Availability", href: "/dashboard/availability", icon: Clock },
    { label: "Bookings", href: "/dashboard/bookings", icon: BookMarked },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-200 px-5 py-6 flex flex-col animate-slideInLeft">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Calendly
            </h1>
            <p className="text-xs text-gray-400">Manage your schedule</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
          {navItems.map(({ label, href, icon: Icon }, index) => (
            <Link
              key={href}
              href={href}
              style={{ animationDelay: `${index * 75}ms` }}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl 
                transition-all duration-300 ease-out animate-fadeInLeft
                ${
                  isActive(href)
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:translate-x-1"
                }
              `}
            >
              {isActive(href) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-6 bg-blue-600 rounded-full animate-scaleIn" />
              )}
              
              <Icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive(href)
                    ? "animate-iconBounce"
                    : "group-hover:scale-110 group-hover:rotate-6"
                }`}
              />
              <span className="font-medium text-sm">{label}</span>
              
              {isActive(href) && (
                <ChevronRight className="w-4 h-4 ml-auto animate-slideRight" />
              )}
              
              {!isActive(href) && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Bottom Section */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Account
          </p>
          
          <Link
            href="/dashboard/settings"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:translate-x-1"
          >
            <Settings className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:translate-x-1"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>

        {/* User Profile Card - Updated with real user data */}
        <div className="mt-6 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 animate-fadeUp">
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {session?.user?.name || "Guest User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email || "No email"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 flex items-center justify-between animate-slideDown">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find((item) => isActive(item.href))?.label || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300 shadow-md"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="animate-fadeUp animation-delay-150">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

