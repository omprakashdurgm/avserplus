import { cn } from "@/lib/utils";
import { Check, Clock, Circle, X } from "lucide-react";
import { StageProgress } from "@/types/candidate";

interface ApplicationTrackerProps {
  stages: StageProgress[];
  compact?: boolean;
}

export const ApplicationTracker = ({ stages, compact = false }: ApplicationTrackerProps) => {
  const getStatusIcon = (status: StageProgress["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-3 w-3" />;
      case "current":
        return <Clock className="h-3 w-3 animate-pulse" />;
      case "rejected":
        return <X className="h-3 w-3" />;
      default:
        return <Circle className="h-2 w-2" />;
    }
  };

  const getStatusColor = (status: StageProgress["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground border-success";
      case "current":
        return "bg-primary text-primary-foreground border-primary";
      case "rejected":
        return "bg-destructive text-destructive-foreground border-destructive";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getLineColor = (status: StageProgress["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "current":
        return "bg-primary";
      case "rejected":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {stages.map((stage, index) => (
          <div key={stage.stage} className="flex items-center">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border",
                getStatusColor(stage.status)
              )}
            >
              {getStatusIcon(stage.status)}
            </div>
            {index < stages.length - 1 && (
              <div className={cn("h-0.5 w-4", getLineColor(stage.status))} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {stages.map((stage, index) => (
        <div key={stage.stage} className="flex gap-3">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                getStatusColor(stage.status)
              )}
            >
              {getStatusIcon(stage.status)}
            </div>
            {index < stages.length - 1 && (
              <div className={cn("w-0.5 flex-1 min-h-8", getLineColor(stages[index + 1].status))} />
            )}
          </div>

          {/* Content */}
          <div className="pb-6 flex-1">
            <p
              className={cn(
                "font-medium text-sm",
                stage.status === "current" && "text-primary",
                stage.status === "completed" && "text-foreground",
                stage.status === "rejected" && "text-destructive",
                stage.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {stage.label}
            </p>
            {stage.date && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(stage.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
            {stage.remarks && (
              <p className="text-xs text-muted-foreground mt-1 italic">{stage.remarks}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
