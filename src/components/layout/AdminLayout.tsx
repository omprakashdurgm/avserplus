import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        {/* Government Header Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[hsl(24,95%,53%)] via-[hsl(0,0%,100%)] to-[hsl(145,63%,35%)]" />
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Ministry of Personnel & Training
            </div>
          </div>
          
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vacancies, applicants..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Admin Officer</p>
                <p className="text-xs text-muted-foreground">Department Admin</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2026 AVSER+ | Government of India | All Rights Reserved</span>
            <span>Version 1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
