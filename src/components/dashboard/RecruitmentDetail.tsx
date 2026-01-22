import { ArrowLeft, Calendar, MapPin, Building2, Users, FileText, Mail, Settings, Archive, Download, CheckCircle, Clock, XCircle, UserCheck, FileCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recruitment, subStageDefinitions, getSubStagesForStage, getScreeningSubStages } from "@/types/recruitment";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

interface RecruitmentDetailProps {
  recruitment: Recruitment;
  onBack: () => void;
  onAction: (action: string) => void;
}

const statusConfig = {
  ongoing: { label: "Ongoing", className: "bg-primary/10 text-primary border-primary/20" },
  draft: { label: "Draft", className: "bg-warning/10 text-warning border-warning/20" },
  "closing-soon": { label: "Needs Attention", className: "bg-destructive/10 text-destructive border-destructive/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground border-muted" },
};

export const RecruitmentDetail = ({
  recruitment,
  onBack,
  onAction,
}: RecruitmentDetailProps) => {
  const status = statusConfig[recruitment.status];
  const currentSubStageInfo = subStageDefinitions.find(s => s.id === recruitment.currentSubStage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-muted-foreground">
              {recruitment.vacancyId}
            </span>
            <Badge variant="outline" className={cn("text-xs", status.className)}>
              {status.label}
            </Badge>
            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
              {recruitment.selectionMethodology.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{recruitment.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {recruitment.department}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {recruitment.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Posted: {recruitment.postedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Card with Sub-stages */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              Current Status: <span className="text-accent capitalize">{currentSubStageInfo?.label || recruitment.currentStage}</span>
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              Step {recruitment.subStageProgress} of 19
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar
            currentStage={recruitment.currentStage}
            currentSubStage={recruitment.currentSubStage}
            stageProgress={recruitment.stageProgress}
            subStageProgress={recruitment.subStageProgress}
            selectionMethodology={recruitment.selectionMethodology}
            showSubStages
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        {recruitment.pendingTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                ⚠️ Pending Tasks ({recruitment.pendingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recruitment.pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    task.priority === "high"
                      ? "bg-destructive/5 border-destructive/20"
                      : task.priority === "medium"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-muted/50 border-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase",
                          task.priority === "high"
                            ? "text-destructive"
                            : task.priority === "medium"
                            ? "text-warning"
                            : "text-muted-foreground"
                        )}
                      >
                        {task.priority} priority
                      </span>
                      <p className="text-sm font-medium mt-1">{task.title}</p>
                    </div>
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      {task.action} →
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Application Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📊 Application Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{recruitment.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Total Received</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/10">
                <p className="text-2xl font-bold text-success">{recruitment.verified}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10">
                <p className="text-2xl font-bold text-warning">{recruitment.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/10">
                <p className="text-2xl font-bold text-destructive">{recruitment.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>

            {/* Category Breakdown */}
            {recruitment.categoryStats && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Category Breakdown</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>General</span>
                    <span className="font-medium">{recruitment.categoryStats.general}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>OBC</span>
                    <span className="font-medium">{recruitment.categoryStats.obc}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>SC</span>
                    <span className="font-medium">{recruitment.categoryStats.sc}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>ST</span>
                    <span className="font-medium">{recruitment.categoryStats.st}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>EWS</span>
                    <span className="font-medium">{recruitment.categoryStats.ews}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span>PwBD</span>
                    <span className="font-medium">{recruitment.categoryStats.pwbd}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Status */}
            {recruitment.feeStatus && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Fee Payment Status</p>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Paid: {recruitment.feeStatus.paid}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-warning" />
                    <span>Pending: {recruitment.feeStatus.pending}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-destructive" />
                    <span>Failed: {recruitment.feeStatus.failed}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shortlisting Results */}
        {recruitment.shortlistingResult && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Shortlisting Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <p className="text-lg font-bold text-success">{recruitment.shortlistingResult.autoEligible}</p>
                  <p className="text-[10px] text-muted-foreground">Auto-Eligible</p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <p className="text-lg font-bold text-destructive">{recruitment.shortlistingResult.autoRejected}</p>
                  <p className="text-[10px] text-muted-foreground">Auto-Rejected</p>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <p className="text-lg font-bold text-accent">{recruitment.shortlistingResult.meritShortlisted}</p>
                  <p className="text-[10px] text-muted-foreground">Merit Shortlisted</p>
                </div>
              </div>
              
              {/* Rejection Reasons */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Auto-Rejection Reasons</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Age Ineligible</span>
                    <span className="text-destructive">{recruitment.shortlistingResult.rejectionReasons.ageIneligible}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Education Below Requirement</span>
                    <span className="text-destructive">{recruitment.shortlistingResult.rejectionReasons.educationBelowRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee Not Paid</span>
                    <span className="text-destructive">{recruitment.shortlistingResult.rejectionReasons.feeNotPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documents Incomplete</span>
                    <span className="text-destructive">{recruitment.shortlistingResult.rejectionReasons.documentsIncomplete}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam Results */}
        {recruitment.examResult && recruitment.examResult.conducted && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Written Exam Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{recruitment.examResult.totalAppeared}</p>
                  <p className="text-[10px] text-muted-foreground">Appeared</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <p className="text-lg font-bold text-success">{recruitment.examResult.passed}</p>
                  <p className="text-[10px] text-muted-foreground">Passed</p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <p className="text-lg font-bold text-destructive">{recruitment.examResult.failed}</p>
                  <p className="text-[10px] text-muted-foreground">Failed</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Cutoff Marks (%)</p>
                <div className="flex gap-4 text-xs">
                  <span>General: {recruitment.examResult.cutoffs.general}%</span>
                  <span>OBC: {recruitment.examResult.cutoffs.obc}%</span>
                  <span>SC/ST: {recruitment.examResult.cutoffs.scst}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interview Results */}
        {recruitment.interviewResult && recruitment.interviewResult.conducted && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Interview Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{recruitment.interviewResult.totalInterviewed}</p>
                  <p className="text-[10px] text-muted-foreground">Interviewed</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <p className="text-lg font-bold text-success">{recruitment.interviewResult.passed}</p>
                  <p className="text-[10px] text-muted-foreground">Qualified</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Marking Scheme</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-1.5 bg-muted/30 rounded">
                    <span>Subject Knowledge</span>
                    <span className="font-medium">{recruitment.interviewResult.markingScheme.subjectKnowledge}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-muted/30 rounded">
                    <span>Teaching Skills</span>
                    <span className="font-medium">{recruitment.interviewResult.markingScheme.teachingSkills}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-muted/30 rounded">
                    <span>Research</span>
                    <span className="font-medium">{recruitment.interviewResult.markingScheme.research}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-muted/30 rounded">
                    <span>General Awareness</span>
                    <span className="font-medium">{recruitment.interviewResult.markingScheme.generalAwareness}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Results */}
        {recruitment.selectionResult && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4" />
                Selection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <p className="text-lg font-bold text-success">{recruitment.selectionResult.selected}</p>
                  <p className="text-[10px] text-muted-foreground">Selected</p>
                </div>
                <div className="p-2 bg-warning/10 rounded-lg">
                  <p className="text-lg font-bold text-warning">{recruitment.selectionResult.waitlisted}</p>
                  <p className="text-[10px] text-muted-foreground">Waitlisted</p>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-muted-foreground">{recruitment.selectionResult.notSelected}</p>
                  <p className="text-[10px] text-muted-foreground">Not Selected</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Acceptance Status</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-success">✓ Accepted: {recruitment.selectionResult.acceptanceStatus.accepted}</span>
                  <span className="text-destructive">✗ Declined: {recruitment.selectionResult.acceptanceStatus.declined}</span>
                  <span className="text-warning">⏳ Pending: {recruitment.selectionResult.acceptanceStatus.pending}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Joining Status</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-success">✓ Joined: {recruitment.selectionResult.joiningStatus.joined}</span>
                  <span className="text-warning">⏳ Pending: {recruitment.selectionResult.joiningStatus.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approval Workflow */}
        {recruitment.approvalWorkflow && recruitment.approvalWorkflow.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📋 Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recruitment.approvalWorkflow.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg border",
                      step.status === "approved" && "bg-success/5 border-success/20",
                      step.status === "pending" && "bg-warning/5 border-warning/20",
                      step.status === "rejected" && "bg-destructive/5 border-destructive/20"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                        step.status === "approved" && "bg-success text-success-foreground",
                        step.status === "pending" && "bg-warning text-warning-foreground",
                        step.status === "rejected" && "bg-destructive text-destructive-foreground"
                      )}>
                        {step.status === "approved" ? "✓" : step.status === "pending" ? "?" : "✗"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{step.role}</p>
                        {step.name && <p className="text-xs text-muted-foreground">{step.name}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px]",
                          step.status === "approved" && "border-success/30 text-success",
                          step.status === "pending" && "border-warning/30 text-warning",
                          step.status === "rejected" && "border-destructive/30 text-destructive"
                        )}
                      >
                        {step.status}
                      </Badge>
                      {step.date && <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📅 Detailed Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recruitment.timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    event.status === "completed"
                      ? "bg-success text-success-foreground"
                      : event.status === "current"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {event.status === "completed" ? "✓" : event.status === "current" ? "●" : "○"}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    event.status === "upcoming" && "text-muted-foreground"
                  )}>
                    {event.stage}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.date}
                    {event.actor && ` (by ${event.actor})`}
                  </p>
                  {event.details && (
                    <p className="text-xs text-accent mt-0.5">{event.details}</p>
                  )}
                </div>
              </div>
            ))}
            {recruitment.daysLeft > 0 && (
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0">
                  !
                </div>
                <div>
                  <p className="font-medium text-destructive">Closing Date</p>
                  <p className="text-sm text-muted-foreground">
                    {recruitment.closingDate} ({recruitment.daysLeft} days left)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🔗 Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => onAction("applications")}>
              <Users className="h-4 w-4" />
              View All Applications
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => onAction("notify")}>
              <Mail className="h-4 w-4" />
              Send Notifications
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => onAction("report")}>
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => onAction("edit")}>
              <Settings className="h-4 w-4" />
              Edit Vacancy
            </Button>
            <Button variant="outline" className="gap-2 text-muted-foreground" onClick={() => onAction("archive")}>
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
