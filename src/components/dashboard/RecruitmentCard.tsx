import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Eye, 
  PlayCircle, 
  MapPin, 
  Building2, 
  Calendar, 
  Users,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Recruitment } from "@/types/recruitment";
import { ProgressBar } from "./ProgressBar";

interface RecruitmentCardProps {
  recruitment: Recruitment;
  onView: (id: string) => void;
  onAction: (id: string) => void;
}

const statusConfig = {
  ongoing: {
    label: "Ongoing",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  draft: {
    label: "Draft",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  "closing-soon": {
    label: "Needs Attention",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export const RecruitmentCard = ({
  recruitment,
  onView,
  onAction,
}: RecruitmentCardProps) => {
  const status = statusConfig[recruitment.status];
  const hasPendingTasks = recruitment.pendingTasks.length > 0;

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-4 transition-all duration-200",
        "hover:shadow-card hover:border-accent/30",
        recruitment.status === "closing-soon" && "border-destructive/30 bg-destructive/5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            #{recruitment.vacancyId}
          </span>
          <Badge variant="outline" className={cn("text-[10px]", status.className)}>
            {status.label}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(recruitment.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Vacancy</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export Report</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
        {recruitment.title}
      </h3>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Building2 className="h-3 w-3" />
          {recruitment.department}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {recruitment.location}
        </span>
        {recruitment.daysLeft > 0 && (
          <span className={cn(
            "flex items-center gap-1",
            recruitment.daysLeft <= 7 && "text-destructive font-medium"
          )}>
            <Calendar className="h-3 w-3" />
            {recruitment.daysLeft} days left
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {recruitment.totalApplications} apps
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <ProgressBar
          currentStage={recruitment.currentStage}
          currentSubStage={recruitment.currentSubStage}
          stageProgress={recruitment.stageProgress}
          subStageProgress={recruitment.subStageProgress}
          selectionMethodology={recruitment.selectionMethodology}
        />
      </div>

      {/* Pending Tasks */}
      {hasPendingTasks && (
        <div className="mb-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
          <div className="flex items-center gap-1.5 text-xs font-medium text-warning mb-2">
            <AlertCircle className="h-3.5 w-3.5" />
            Pending Actions ({recruitment.pendingTasks.length})
          </div>
          <ul className="space-y-1">
            {recruitment.pendingTasks.slice(0, 2).map((task) => (
              <li key={task.id} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                  task.priority === "high" ? "bg-destructive" : task.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                )} />
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(recruitment.id)}
          className="flex-1 h-9"
        >
          <Eye className="h-4 w-4 mr-1.5" />
          View Details
        </Button>
        {hasPendingTasks && (
          <Button
            size="sm"
            onClick={() => onAction(recruitment.id)}
            className="flex-1 h-9 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <PlayCircle className="h-4 w-4 mr-1.5" />
            Take Action
          </Button>
        )}
      </div>
    </div>
  );
};
