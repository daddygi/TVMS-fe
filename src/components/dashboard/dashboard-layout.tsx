import { useState, useCallback, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
  headerRight?: ReactNode;
}

export function DashboardLayout({
  title,
  children,
  headerRight,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Burger menu - mobile only */}
            <button
              onClick={openSidebar}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
              {title}
            </h1>
          </div>
          {headerRight}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
