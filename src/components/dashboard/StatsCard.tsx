import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconClassName,
}: StatsCardProps) => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconClassName || "bg-accent/10 text-accent"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
