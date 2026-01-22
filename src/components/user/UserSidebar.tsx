import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Download,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UserSidebarProps {
  unreadNotifications?: number;
  onNavigate?: () => void;
  isMobile?: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/user" },
  { icon: FileText, label: "My Applications", path: "/user/applications" },
  { icon: Bell, label: "Notifications", path: "/user/notifications", badge: true },
  { icon: Download, label: "Downloads", path: "/user/downloads" },
  { icon: User, label: "Profile", path: "/user/profile" },
  { icon: HelpCircle, label: "Help & Support", path: "/user/help" },
];

export const UserSidebar = ({ 
  unreadNotifications = 0, 
  onNavigate,
  isMobile = false 
}: UserSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  // For mobile, never collapse
  const isCollapsed = isMobile ? false : collapsed;

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
        isMobile ? "w-full" : "fixed left-0 top-0 z-40",
        !isMobile && (isCollapsed ? "w-20" : "w-64")
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 lg:h-20 items-center justify-between border-b border-border px-4">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                <span className="text-sm font-bold text-primary">A+</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground tracking-wide">AVSER+</h1>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Candidate Portal</p>
              </div>
            </div>
          )}
          {isCollapsed && !isMobile && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
              <span className="text-sm font-bold text-primary">A+</span>
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
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && unreadNotifications > 0 && (
                      <Badge className="ml-auto h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </>
                )}
                {isCollapsed && !isMobile && item.badge && unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <button 
            onClick={handleNavClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle - Desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-transform hover:scale-110"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
