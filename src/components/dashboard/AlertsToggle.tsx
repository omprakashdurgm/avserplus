import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertsToggleProps {
  count: number;
  onClick: () => void;
  isOpen: boolean;
}

export const AlertsToggle = ({ count, onClick, isOpen }: AlertsToggleProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-elevated transition-all duration-200",
        "bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105",
        isOpen && "translate-x-[-320px]"
      )}
    >
      <AlertCircle className="h-6 w-6" />
      {count > 0 && (
        <Badge className="absolute -top-1 -right-1 h-6 min-w-6 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground animate-pulse">
          {count}
        </Badge>
      )}
    </Button>
  );
};
