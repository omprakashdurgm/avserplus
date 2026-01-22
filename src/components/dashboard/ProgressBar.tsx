import { cn } from "@/lib/utils";
import { 
  RecruitmentStage, 
  SubStage, 
  subStageDefinitions, 
  getSubStagesForStage,
  SelectionMethodology,
  getScreeningSubStages
} from "@/types/recruitment";
import { 
  FileText, 
  Users, 
  CheckCircle, 
  ClipboardList, 
  Award, 
  Trophy,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import { useState } from "react";

interface ProgressBarProps {
  currentStage: RecruitmentStage;
  currentSubStage?: SubStage;
  stageProgress: number;
  subStageProgress?: number;
  selectionMethodology?: SelectionMethodology;
  compact?: boolean;
  showSubStages?: boolean;
}

const stages: { key: RecruitmentStage; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { key: "published", label: "Published", shortLabel: "Pub", icon: FileText },
  { key: "applications", label: "Applications", shortLabel: "Apps", icon: Users },
  { key: "verification", label: "Verification", shortLabel: "Ver", icon: CheckCircle },
  { key: "screening", label: "Screening", shortLabel: "Scr", icon: ClipboardList },
  { key: "evaluation", label: "Evaluation", shortLabel: "Eval", icon: Award },
  { key: "selection", label: "Selection", shortLabel: "Sel", icon: Trophy },
];

export const ProgressBar = ({
  currentStage,
  currentSubStage,
  stageProgress,
  subStageProgress = 0,
  selectionMethodology = "exam_and_interview",
  compact = false,
  showSubStages = false,
}: ProgressBarProps) => {
  const [expandedStage, setExpandedStage] = useState<RecruitmentStage | null>(null);
  const currentIndex = stages.findIndex((s) => s.key === currentStage);
  const percentage = subStageProgress > 0 
    ? Math.round((subStageProgress / 19) * 100)
    : Math.round((stageProgress / 6) * 100);

  const getSubStagesForDisplay = (stage: RecruitmentStage) => {
    if (stage === "screening") {
      return getScreeningSubStages(selectionMethodology);
    }
    return getSubStagesForStage(stage);
  };

  const isSubStageCompleted = (subStage: SubStage) => {
    const subStageInfo = subStageDefinitions.find(s => s.id === subStage);
    return subStageInfo ? subStageInfo.order < subStageProgress : false;
  };

  const isSubStageCurrent = (subStage: SubStage) => {
    return subStage === currentSubStage;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className={cn(
                "w-4 h-1.5 rounded-full transition-colors",
                index < stageProgress
                  ? "bg-success"
                  : index === stageProgress
                  ? "bg-accent"
                  : "bg-muted"
              )}
              title={stage.label}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">
          Stage {stageProgress} of 6 ({percentage}% Complete)
        </span>
        {currentSubStage && (
          <span className="text-muted-foreground">
            Current: {subStageDefinitions.find(s => s.id === currentSubStage)?.label}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {stages.map((stage, index) => {
          const isCompleted = index < stageProgress;
          const isCurrent = index === stageProgress - 1;
          const isUpcoming = index >= stageProgress;
          const subStages = getSubStagesForDisplay(stage.key);
          const isExpanded = expandedStage === stage.key;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex flex-col flex-1">
              <div 
                className={cn(
                  "flex flex-col items-center flex-1 cursor-pointer transition-all",
                  showSubStages && "hover:opacity-80"
                )}
                onClick={() => showSubStages && setExpandedStage(isExpanded ? null : stage.key)}
              >
                <div className="flex items-center gap-1 w-full">
                  <div
                    className={cn(
                      "w-full h-2 rounded-full transition-all duration-300",
                      isCompleted
                        ? "bg-success"
                        : isCurrent
                        ? "bg-accent"
                        : "bg-muted"
                    )}
                  />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Icon 
                    className={cn(
                      "w-3 h-3",
                      isCompleted
                        ? "text-success"
                        : isCurrent
                        ? "text-accent"
                        : "text-muted-foreground"
                    )} 
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isCompleted
                        ? "text-success"
                        : isCurrent
                        ? "text-accent"
                        : "text-muted-foreground"
                    )}
                  >
                    {stage.shortLabel}
                  </span>
                  {showSubStages && subStages.length > 0 && (
                    isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    )
                  )}
                </div>
              </div>

              {/* Sub-stages dropdown */}
              {showSubStages && isExpanded && subStages.length > 0 && (
                <div className="mt-2 bg-muted/50 rounded-md p-2 space-y-1">
                  {subStages.map((subStage) => {
                    const isSubCompleted = isSubStageCompleted(subStage.id);
                    const isSubCurrent = isSubStageCurrent(subStage.id);
                    
                    return (
                      <div 
                        key={subStage.id}
                        className={cn(
                          "flex items-center gap-2 text-[10px] py-1 px-2 rounded",
                          isSubCompleted && "bg-success/10",
                          isSubCurrent && "bg-accent/10 border border-accent/30"
                        )}
                      >
                        <div 
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSubCompleted
                              ? "bg-success"
                              : isSubCurrent
                              ? "bg-accent"
                              : "bg-muted-foreground/30"
                          )}
                        />
                        <span
                          className={cn(
                            isSubCompleted
                              ? "text-success"
                              : isSubCurrent
                              ? "text-accent font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {subStage.shortLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
