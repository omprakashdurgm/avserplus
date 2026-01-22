import { ReactNode, useState } from "react";
import { UserSidebar } from "./UserSidebar";
import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";

interface UserLayoutProps {
  children: ReactNode;
  userName?: string;
  unreadNotifications?: number;
}

export const UserLayout = ({
  children,
  userName = "Amit Kumar",
  unreadNotifications = 2
}: UserLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <UserSidebar unreadNotifications={unreadNotifications} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Tricolor Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[hsl(24,95%,53%)] via-[hsl(0,0%,100%)] to-[hsl(145,63%,35%)]" />

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 lg:px-6 backdrop-blur-sm">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <UserSidebar
                  unreadNotifications={unreadNotifications}
                  onNavigate={() => setMobileMenuOpen(false)}
                  isMobile
                />
              </SheetContent>
            </Sheet>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                <span className="text-xs font-bold text-primary">A+</span>
              </div>
              <span className="font-bold text-sm">AVSER+</span>
            </div>

            {/* Desktop Ministry Text */}
            <span className="hidden lg:block text-xs uppercase tracking-wider text-muted-foreground">
              Government of India | Ministry of Personnel & Training
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-[10px] text-muted-foreground">Candidate</p>
              </div>
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-5 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-4 lg:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="text-center sm:text-left">© 2026 AVSER+ | Government of India</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Help</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
