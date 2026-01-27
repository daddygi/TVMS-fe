import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/api";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/dashboard/spatial", icon: MapPin, label: "Spatial Analytics", exact: false },
  { to: "/dashboard/violations", icon: FileText, label: "Violation Logs", exact: false },
  { to: "/dashboard/officers", icon: Users, label: "Officers", exact: false },
] as const;

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const isActive = (to: string, exact: boolean) => {
    if (exact) {
      return location.pathname === to || location.pathname === `${to}/`;
    }
    return location.pathname.startsWith(to);
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay - only render when open on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-56 shrink-0 flex-col bg-[#1a3a5c] transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0",
          !open && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3">
            <img
              src="/lto-logo.jpeg"
              alt="LTO Logo"
              className="h-10 w-10 rounded-full bg-white object-contain p-1"
            />
            <div>
              <h1 className="text-lg font-bold text-white">TVMS</h1>
              <p className="text-xs text-gray-300">Operations Division</p>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-300 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
