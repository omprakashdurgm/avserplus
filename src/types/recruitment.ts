export type RecruitmentStatus = "ongoing" | "draft" | "closing-soon" | "completed" | "archived";

// 6 Main Stages (each contains sub-stages from 15-stage workflow)
export type RecruitmentStage = 
  | "published"      // Stage 1: Notification Published
  | "applications"   // Stages 2-3: Applications Open, Applications Closed
  | "verification"   // Stages 4-6: Auto-Shortlisting, Document Verification, Merit List
  | "screening"      // Stage 7: Exam/Interview (7A-7D scenarios)
  | "evaluation"     // Stages 8-10: Final Merit Score, Final Merit List, Approval
  | "selection";     // Stages 11-15: Selection List, Publish & Notify, Acceptance, Joining, Complete

// Detailed 15-stage sub-stages
export type SubStage =
  // Stage 1: Published
  | "notification_published"
  // Stage 2-3: Applications
  | "applications_open"
  | "applications_closed"
  // Stage 4-6: Verification
  | "auto_shortlisting"
  | "document_verification"
  | "merit_list_published"
  // Stage 7: Screening (Exam/Interview)
  | "exam_scheduled"
  | "exam_conducted"
  | "interview_scheduled"
  | "interview_conducted"
  // Stage 8-10: Evaluation
  | "final_merit_calculation"
  | "final_merit_list"
  | "approval_pending"
  | "approval_complete"
  // Stage 11-15: Selection
  | "selection_list_generated"
  | "results_published"
  | "acceptance_tracking"
  | "joining_formalities"
  | "recruitment_complete";

export type SelectionMethodology = "exam_only" | "interview_only" | "exam_and_interview";

export interface SubStageInfo {
  id: SubStage;
  label: string;
  shortLabel: string;
  parentStage: RecruitmentStage;
  order: number;
}

// Complete sub-stage definitions mapped to parent stages
export const subStageDefinitions: SubStageInfo[] = [
  // Published (1)
  { id: "notification_published", label: "Notification Published", shortLabel: "Published", parentStage: "published", order: 1 },
  // Applications (2-3)
  { id: "applications_open", label: "Applications Open", shortLabel: "Open", parentStage: "applications", order: 2 },
  { id: "applications_closed", label: "Applications Closed", shortLabel: "Closed", parentStage: "applications", order: 3 },
  // Verification (4-6)
  { id: "auto_shortlisting", label: "Automatic Shortlisting", shortLabel: "Auto-Short", parentStage: "verification", order: 4 },
  { id: "document_verification", label: "Document Verification", shortLabel: "Doc Verify", parentStage: "verification", order: 5 },
  { id: "merit_list_published", label: "Merit List Published", shortLabel: "Merit List", parentStage: "verification", order: 6 },
  // Screening (7)
  { id: "exam_scheduled", label: "Exam Scheduled", shortLabel: "Exam Sched", parentStage: "screening", order: 7 },
  { id: "exam_conducted", label: "Exam Conducted", shortLabel: "Exam Done", parentStage: "screening", order: 8 },
  { id: "interview_scheduled", label: "Interview Scheduled", shortLabel: "Int Sched", parentStage: "screening", order: 9 },
  { id: "interview_conducted", label: "Interview Conducted", shortLabel: "Int Done", parentStage: "screening", order: 10 },
  // Evaluation (8-10)
  { id: "final_merit_calculation", label: "Final Merit Calculation", shortLabel: "Calc Merit", parentStage: "evaluation", order: 11 },
  { id: "final_merit_list", label: "Final Merit List", shortLabel: "Final List", parentStage: "evaluation", order: 12 },
  { id: "approval_pending", label: "Approval Pending", shortLabel: "Approval", parentStage: "evaluation", order: 13 },
  { id: "approval_complete", label: "Approval Complete", shortLabel: "Approved", parentStage: "evaluation", order: 14 },
  // Selection (11-15)
  { id: "selection_list_generated", label: "Selection List Generated", shortLabel: "Select List", parentStage: "selection", order: 15 },
  { id: "results_published", label: "Results Published", shortLabel: "Published", parentStage: "selection", order: 16 },
  { id: "acceptance_tracking", label: "Acceptance Tracking", shortLabel: "Acceptance", parentStage: "selection", order: 17 },
  { id: "joining_formalities", label: "Joining Formalities", shortLabel: "Joining", parentStage: "selection", order: 18 },
  { id: "recruitment_complete", label: "Recruitment Complete", shortLabel: "Complete", parentStage: "selection", order: 19 },
];

// Get sub-stages for a specific main stage
export const getSubStagesForStage = (stage: RecruitmentStage): SubStageInfo[] => {
  return subStageDefinitions.filter(s => s.parentStage === stage);
};

// Get sub-stages based on selection methodology (for screening stage)
export const getScreeningSubStages = (methodology: SelectionMethodology): SubStageInfo[] => {
  const screening = subStageDefinitions.filter(s => s.parentStage === "screening");
  switch (methodology) {
    case "exam_only":
      return screening.filter(s => s.id === "exam_scheduled" || s.id === "exam_conducted");
    case "interview_only":
      return screening.filter(s => s.id === "interview_scheduled" || s.id === "interview_conducted");
    case "exam_and_interview":
      return screening;
  }
};

export interface PendingTask {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  action: string;
}

// Application statistics by category
export interface CategoryStats {
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
  pwbd: number;
}

// Shortlisting results
export interface ShortlistingResult {
  totalReceived: number;
  autoEligible: number;
  autoRejected: number;
  rejectionReasons: {
    ageIneligible: number;
    educationBelowRequirement: number;
    feeNotPaid: number;
    documentsIncomplete: number;
  };
  meritShortlisted: number;
  categoryBreakdown: CategoryStats;
}

// Exam/Interview scores
export interface ExamResult {
  conducted: boolean;
  totalAppeared: number;
  passed: number;
  failed: number;
  cutoffs: {
    general: number;
    obc: number;
    scst: number;
  };
}

export interface InterviewResult {
  conducted: boolean;
  totalInterviewed: number;
  passed: number;
  markingScheme: {
    subjectKnowledge: number;
    teachingSkills: number;
    research: number;
    generalAwareness: number;
  };
}

// Final selection data
export interface SelectionResult {
  selected: number;
  waitlisted: number;
  notSelected: number;
  acceptanceStatus: {
    accepted: number;
    declined: number;
    pending: number;
  };
  joiningStatus: {
    joined: number;
    pending: number;
  };
}

// Approval workflow
export interface ApprovalStep {
  role: string;
  name?: string;
  status: "pending" | "approved" | "rejected";
  date?: string;
  remarks?: string;
}

export interface Recruitment {
  id: string;
  vacancyId: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: RecruitmentStatus;
  currentStage: RecruitmentStage;
  currentSubStage: SubStage;
  stageProgress: number; // 1-6 for main stages
  subStageProgress: number; // 1-19 for detailed progress
  selectionMethodology: SelectionMethodology;
  
  // Application stats
  totalApplications: number;
  categoryStats: CategoryStats;
  genderStats: {
    male: number;
    female: number;
    others: number;
  };
  feeStatus: {
    paid: number;
    pending: number;
    failed: number;
  };
  
  // Processing stats
  verified: number;
  pending: number;
  rejected: number;
  shortlisted: number;
  
  // Shortlisting results (Stage 4-6)
  shortlistingResult?: ShortlistingResult;
  
  // Exam/Interview results (Stage 7)
  examResult?: ExamResult;
  interviewResult?: InterviewResult;
  
  // Final selection (Stages 8-15)
  selectionResult?: SelectionResult;
  approvalWorkflow?: ApprovalStep[];
  
  postedDate: string;
  closingDate: string;
  daysLeft: number;
  pendingTasks: PendingTask[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  stage: string;
  subStage?: SubStage;
  date: string;
  status: "completed" | "current" | "upcoming";
  actor?: string;
  details?: string;
}

export interface Alert {
  id: string;
  type: "urgent" | "important" | "reminder";
  title: string;
  description: string;
  recruitmentId?: string;
  timestamp: string;
}

export interface DashboardStats {
  ongoing: number;
  drafts: number;
  closingSoon: number;
  completed: number;
  total: number;
  ongoingChange: string;
  draftsNote: string;
  closingSoonNote: string;
  completedNote: string;
}

// Helper to get main stage from sub-stage
export const getMainStageFromSubStage = (subStage: SubStage): RecruitmentStage => {
  const info = subStageDefinitions.find(s => s.id === subStage);
  return info?.parentStage || "published";
};

// Helper to calculate overall progress percentage
export const calculateProgressPercentage = (subStageProgress: number): number => {
  return Math.round((subStageProgress / 19) * 100);
};

// Helper to get stage number (1-6) from stage
export const getStageNumber = (stage: RecruitmentStage): number => {
  const stageMap: Record<RecruitmentStage, number> = {
    published: 1,
    applications: 2,
    verification: 3,
    screening: 4,
    evaluation: 5,
    selection: 6,
  };
  return stageMap[stage];
};
