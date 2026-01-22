export interface CandidateApplication {
  id: string;
  applicationNo: string;
  vacancyId: string;
  vacancyTitle: string;
  department: string;
  appliedDate: string;
  currentStage: CandidateStage;
  stageProgress: StageProgress[];
  status: "active" | "selected" | "waitlisted" | "rejected" | "withdrawn";
  examDetails?: ExamDetails;
  interviewDetails?: InterviewDetails;
  offerDetails?: OfferDetails;
  documents: CandidateDocument[];
  notifications: CandidateNotification[];
}

export type CandidateStage = 
  | "application_submitted"
  | "application_under_review"
  | "shortlisted"
  | "not_shortlisted"
  | "document_verification"
  | "documents_verified"
  | "documents_rejected"
  | "merit_list_published"
  | "exam_scheduled"
  | "exam_completed"
  | "interview_scheduled"
  | "interview_completed"
  | "final_result_pending"
  | "selected"
  | "waitlisted"
  | "not_selected"
  | "offer_sent"
  | "offer_accepted"
  | "offer_declined"
  | "joining_pending"
  | "joined";

export interface StageProgress {
  stage: CandidateStage;
  label: string;
  status: "completed" | "current" | "upcoming" | "rejected";
  date?: string;
  remarks?: string;
}

export interface ExamDetails {
  examDate: string;
  examTime: string;
  venue: string;
  reportingTime: string;
  admitCardUrl?: string;
  marksObtained?: number;
  totalMarks: number;
  cutoff: number;
  qualified?: boolean;
  rank?: number;
}

export interface InterviewDetails {
  interviewDate: string;
  interviewTime: string;
  venue: string;
  mode: "online" | "offline" | "hybrid";
  panelInfo?: string;
  marksObtained?: number;
  totalMarks: number;
  qualified?: boolean;
}

export interface OfferDetails {
  offerLetterUrl?: string;
  offerDate: string;
  acceptanceDeadline: string;
  joiningDate: string;
  position: string;
  payScale: string;
  location: string;
  responseStatus?: "pending" | "accepted" | "declined";
}

export interface CandidateDocument {
  id: string;
  name: string;
  type: "admit_card" | "result" | "offer_letter" | "merit_list" | "appointment_order";
  url: string;
  generatedDate: string;
  expiryDate?: string;
}

export interface CandidateNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  date: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  photo?: string;
  applications: CandidateApplication[];
  totalApplications: number;
  activeApplications: number;
  unreadNotifications: number;
}
