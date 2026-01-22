import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recruitment } from "@/types/recruitment";
import { ProgressBar } from "./ProgressBar";

interface RecruitmentTableViewProps {
  recruitments: Recruitment[];
  onView: (id: string) => void;
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
    label: "Urgent",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  completed: {
    label: "Done",
    className: "bg-success/10 text-success border-success/20",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export const RecruitmentTableView = ({
  recruitments,
  onView,
}: RecruitmentTableViewProps) => {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden animate-slide-up">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold w-24">ID</TableHead>
            <TableHead className="font-semibold">Vacancy</TableHead>
            <TableHead className="font-semibold">Dept</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Progress</TableHead>
            <TableHead className="font-semibold text-center">Apps</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recruitments.map((recruitment, index) => {
            const status = statusConfig[recruitment.status];
            return (
              <TableRow
                key={recruitment.id}
                className="transition-colors hover:bg-muted/30 cursor-pointer"
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => onView(recruitment.id)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {recruitment.vacancyId.split("-").pop()}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{recruitment.title}</p>
                    <p className="text-xs text-muted-foreground">{recruitment.location}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {recruitment.department.split(" ")[0]}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px]", status.className)}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="min-w-[120px]">
                  <ProgressBar
                    currentStage={recruitment.currentStage}
                    currentSubStage={recruitment.currentSubStage}
                    stageProgress={recruitment.stageProgress}
                    subStageProgress={recruitment.subStageProgress}
                    compact
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Users className="h-3 w-3" />
                    {recruitment.totalApplications}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(recruitment.id);
                    }}
                    className="h-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
