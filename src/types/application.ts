// Application types for AVSER+ Recruitment Portal

export interface PersonalDetails {
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female" | "other";
  category: "general" | "obc" | "sc" | "st" | "ews";
  pwbd: boolean;
  nationality: string;
  maritalStatus: string;
}

export interface ContactInfo {
  email: string;
  mobile: string;
  altMobile: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
}

export interface EducationalQualification {
  degree: string;
  university: string;
  year: number;
  percentage: string;
  documentUploaded: boolean;
}

export interface Experience {
  position: string;
  institution: string;
  duration: string;
  years: number;
  documentUploaded: boolean;
}

export interface PaymentDetails {
  transactionId: string;
  amount: number;
  date: string;
  mode: string;
  status: "success" | "pending" | "failed";
}

export interface UploadedDocument {
  name: string;
  uploaded: boolean;
  fileUrl?: string;
  size?: string;
}

export type ApplicationStatus = 
  | "complete" 
  | "incomplete" 
  | "pending" 
  | "verified" 
  | "rejected"
  | "shortlisted";

export interface Application {
  id: string;
  applicationNo: string;
  vacancyId: string;
  vacancyTitle: string;
  
  // Personal
  personalDetails: PersonalDetails;
  contactInfo: ContactInfo;
  
  // Qualifications
  qualifications: EducationalQualification[];
  netGateQualification?: {
    type: "NET" | "GATE" | "SLET";
    qualified: boolean;
    rollNo: string;
    year: number;
  };
  
  // Experience
  experience: Experience[];
  publications: {
    total: number;
    international: number;
    national: number;
    conferences: number;
  };
  
  // Documents & Payment
  documents: UploadedDocument[];
  payment: PaymentDetails;
  
  // Status
  status: ApplicationStatus;
  submittedOn: string;
  ipAddress: string;
  
  // Verification
  verificationStatus?: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verificationDate?: string;
  verificationRemarks?: string;
}

export interface ApplicationStats {
  total: number;
  today: number;
  yesterday: number;
  thisWeek: number;
  
  categoryWise: {
    general: number;
    obc: number;
    sc: number;
    st: number;
    ews: number;
    pwbd: number;
  };
  
  genderWise: {
    male: number;
    female: number;
    other: number;
  };
  
  feeStatus: {
    paid: number;
    pending: number;
    failed: number;
  };
  
  completionStatus: {
    complete: number;
    incomplete: number;
    verified: number;
    rejected: number;
  };
}

export interface DeadlineSettings {
  closingDate: string;
  closingTime: string;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
  };
  autoCloseSettings: {
    stopAccepting: boolean;
    allowPendingFee: boolean;
    pendingFeeBuffer: number; // hours
    sendFinalReminder: boolean;
    reminderHours: number;
    generateClosureReport: boolean;
  };
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const defaultMessageTemplates: MessageTemplate[] = [
  {
    id: "1",
    name: "Reminder: Application closing in 24 hours",
    subject: "Urgent: Application deadline approaching",
    body: "Dear Candidate,\n\nThis is to remind you that the last date for submitting your application for the post of [POST_NAME] is [CLOSING_DATE]. Please ensure your application is complete and fee is paid before the deadline.\n\nRegards,\nAVSER+ Recruitment Portal"
  },
  {
    id: "2",
    name: "Application received successfully",
    subject: "Application Received - [APPLICATION_NO]",
    body: "Dear Candidate,\n\nYour application has been successfully received. Your application number is [APPLICATION_NO]. Please save this for future reference.\n\nRegards,\nAVSER+ Recruitment Portal"
  },
  {
    id: "3",
    name: "Fee payment pending",
    subject: "Action Required: Complete your fee payment",
    body: "Dear Candidate,\n\nWe noticed that your application fee payment is still pending. Please complete the payment before [CLOSING_DATE] to avoid rejection of your application.\n\nRegards,\nAVSER+ Recruitment Portal"
  },
  {
    id: "4",
    name: "Document verification required",
    subject: "Document Verification - Additional documents needed",
    body: "Dear Candidate,\n\nDuring verification, we found some issues with your documents. Please re-upload the required documents in the correction window.\n\nRegards,\nAVSER+ Recruitment Portal"
  },
];
