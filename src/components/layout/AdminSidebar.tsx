import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileCheck,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Briefcase, label: "Vacancies", path: "/vacancies" },
  { icon: Users, label: "Applications", path: "/applications" },
  { icon: ClipboardList, label: "Screening", path: "/screening" },
  { icon: FileCheck, label: "Evaluations", path: "/evaluations" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-24 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-sidebar-primary bg-sidebar-primary/10">
                <span className="text-base font-bold text-sidebar-primary">A+</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground tracking-wide">AVSER+</h1>
                <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Govt. of India</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-sidebar-primary bg-sidebar-primary/10">
              <span className="text-base font-bold text-sidebar-primary">A+</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-transform hover:scale-110"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
};
