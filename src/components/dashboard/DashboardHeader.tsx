import { Bell, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  notificationCount?: number;
  adminName?: string;
}

export const DashboardHeader = ({
  notificationCount = 3,
  adminName = "Admin Officer",
}: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      {/* Tricolor strip */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            AVSER+ Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Recruitment Management System • Ministry of Personnel & Training
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">
                  {notificationCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-destructive">🔴 Urgent</span>
                <span className="text-sm text-muted-foreground">
                  VAC-045: 120 apps pending verification
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-warning">🟠 Important</span>
                <span className="text-sm text-muted-foreground">
                  2 recruitments need evaluators
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium text-muted-foreground">🟡 Reminder</span>
                <span className="text-sm text-muted-foreground">
                  Monthly report due in 5 days
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-accent justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* Admin Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{adminName}</p>
                  <p className="text-[10px] text-muted-foreground">Super Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Activity Log</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
