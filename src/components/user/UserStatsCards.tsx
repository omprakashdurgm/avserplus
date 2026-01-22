import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStatsCardsProps {
  totalApplications: number;
  activeApplications: number;
  selectedCount: number;
  pendingActions: number;
}

export const UserStatsCards = ({
  totalApplications,
  activeApplications,
  selectedCount,
  pendingActions,
}: UserStatsCardsProps) => {
  const stats = [
    {
      label: "Total",
      fullLabel: "Total Applications",
      value: totalApplications,
      icon: FileText,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      label: "Active",
      fullLabel: "In Progress",
      value: activeApplications,
      icon: Clock,
      colorClass: "text-warning",
      bgClass: "bg-warning/10",
    },
    {
      label: "Selected",
      fullLabel: "Selected",
      value: selectedCount,
      icon: CheckCircle,
      colorClass: "text-success",
      bgClass: "bg-success/10",
    },
    {
      label: "Pending",
      fullLabel: "Actions Pending",
      value: pendingActions,
      icon: AlertTriangle,
      colorClass: "text-destructive",
      bgClass: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border bg-card"
        >
          <div className={cn("flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0", stat.bgClass)}>
            <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.colorClass)} />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              <span className="sm:hidden">{stat.label}</span>
              <span className="hidden sm:inline">{stat.fullLabel}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
