import { cn } from "@/lib/utils";
import { RefreshCw, FileEdit, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { DashboardStats, RecruitmentStatus } from "@/types/recruitment";

interface SummaryCardsProps {
  stats: DashboardStats;
  activeFilter: RecruitmentStatus | "all";
  onFilterChange: (filter: RecruitmentStatus | "all") => void;
}

interface StatCardProps {
  label: string;
  value: number;
  note: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  isActive: boolean;
  onClick: () => void;
}

const StatCard = ({
  label,
  value,
  note,
  icon: Icon,
  colorClass,
  bgClass,
  isActive,
  onClick,
}: StatCardProps) => (
  <button
    onClick={onClick}
    className={cn(
      "relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left w-full",
      "hover:shadow-card hover:scale-[1.02]",
      isActive
        ? "border-accent bg-accent/5 ring-2 ring-accent/20"
        : "border-border bg-card hover:border-accent/50"
    )}
  >
    <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg mb-3", bgClass)}>
      <Icon className={cn("h-5 w-5", colorClass)} />
    </div>
    <span className="text-2xl font-bold text-foreground">{value}</span>
    <span className="text-sm font-medium text-foreground/80 mt-0.5">{label}</span>
    <span className={cn("text-xs mt-1", colorClass)}>{note}</span>
    {isActive && (
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-pulse" />
    )}
  </button>
);

export const SummaryCards = ({
  stats,
  activeFilter,
  onFilterChange,
}: SummaryCardsProps) => {
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          📊 Overview — {currentMonth}
        </h2>
        <button
          onClick={() => onFilterChange("all")}
          className={cn(
            "text-xs font-medium transition-colors",
            activeFilter === "all" ? "text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Ongoing"
          value={stats.ongoing}
          note={stats.ongoingChange}
          icon={RefreshCw}
          colorClass="text-primary"
          bgClass="bg-primary/10"
          isActive={activeFilter === "ongoing"}
          onClick={() => onFilterChange("ongoing")}
        />
        <StatCard
          label="Drafts"
          value={stats.drafts}
          note={stats.draftsNote}
          icon={FileEdit}
          colorClass="text-warning"
          bgClass="bg-warning/10"
          isActive={activeFilter === "draft"}
          onClick={() => onFilterChange("draft")}
        />
        <StatCard
          label="Closing Soon"
          value={stats.closingSoon}
          note={stats.closingSoonNote}
          icon={AlertTriangle}
          colorClass="text-destructive"
          bgClass="bg-destructive/10"
          isActive={activeFilter === "closing-soon"}
          onClick={() => onFilterChange("closing-soon")}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          note={stats.completedNote}
          icon={CheckCircle}
          colorClass="text-success"
          bgClass="bg-success/10"
          isActive={activeFilter === "completed"}
          onClick={() => onFilterChange("completed")}
        />
        <StatCard
          label="Total Active"
          value={stats.total}
          note="All recruitments"
          icon={BarChart3}
          colorClass="text-accent"
          bgClass="bg-accent/10"
          isActive={activeFilter === "all"}
          onClick={() => onFilterChange("all")}
        />
      </div>
    </div>
  );
};
