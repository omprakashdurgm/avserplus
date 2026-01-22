// Vacancy form data types for AVSER+ Recruitment Portal

export interface ReservationCategory {
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
  pwbd: number;
}

export interface PayScale {
  payBand: string;
  gradePay: string;
  agp: string;
  totalEmoluments: string;
}

export interface AgeLimit {
  minimum: number;
  maximum: number;
  relaxationOBC: number;
  relaxationSCST: number;
  relaxationPwBD: number;
  relaxationExServicemen: string;
}

export interface EligibilityCriteria {
  essentialQualifications: string[];
  desirableQualifications: string[];
  ageLimit: AgeLimit;
  teachingExperience: string;
  researchExperience: string;
  otherRequirements: string[];
}

export interface ImportantDates {
  advertisementDate: string;
  applicationStartDate: string;
  applicationStartTime: string;
  applicationEndDate: string;
  applicationEndTime: string;
  lastDateForFee: string;
  correctionWindowStart: string;
  correctionWindowEnd: string;
  admitCardRelease: string;
  examinationDate: string;
}

export interface ApplicationFee {
  generalOBCEWS: number;
  scStPwbdWomen: number;
  examinationFee: number;
  paymentModes: string[];
  refundPolicy: string;
}

export interface SelectionStage {
  stage: number;
  name: string;
  marks?: number;
}

export interface SelectionProcess {
  stages: SelectionStage[];
  interviewMarking: {
    subjectKnowledge: number;
    teachingSkills: number;
    researchPublications: number;
    generalAwareness: number;
  };
  minimumQualifyingMarks: {
    general: number;
    obc: number;
    scStPwbd: number;
  };
}

export interface DocumentRequirement {
  id: string;
  name: string;
  mandatory: boolean;
  maxSize: string;
  format: string;
}

export interface AdvertisementSettings {
  notificationNumber: string;
  publishTo: {
    officialWebsite: boolean;
    employmentNews: boolean;
    newspapers: boolean;
    emailNotification: boolean;
    socialMedia: boolean;
  };
  newspaperDetails: {
    national: number;
    regional: number;
  };
}

export interface VacancyFormData {
  // Basic Information
  postName: string;
  department: string;
  vacancyId: string;
  numberOfPosts: number;
  reservationCategory: ReservationCategory;
  employmentType: 'permanent' | 'temporary' | 'contract';
  payScale: PayScale;
  location: string;
  
  // Eligibility Criteria
  eligibility: EligibilityCriteria;
  
  // Important Dates
  dates: ImportantDates;
  
  // Application Fee
  fee: ApplicationFee;
  
  // Selection Process
  selection: SelectionProcess;
  
  // Document Requirements
  documents: DocumentRequirement[];
  
  // Advertisement
  advertisement: AdvertisementSettings;
  
  // Job Description
  description: string;
}

export const defaultVacancyFormData: VacancyFormData = {
  postName: '',
  department: '',
  vacancyId: '',
  numberOfPosts: 1,
  reservationCategory: {
    general: 0,
    obc: 0,
    sc: 0,
    st: 0,
    ews: 0,
    pwbd: 0,
  },
  employmentType: 'permanent',
  payScale: {
    payBand: '',
    gradePay: '',
    agp: '',
    totalEmoluments: '',
  },
  location: '',
  eligibility: {
    essentialQualifications: [''],
    desirableQualifications: [''],
    ageLimit: {
      minimum: 21,
      maximum: 40,
      relaxationOBC: 3,
      relaxationSCST: 5,
      relaxationPwBD: 10,
      relaxationExServicemen: 'As per rules',
    },
    teachingExperience: '',
    researchExperience: '',
    otherRequirements: [],
  },
  dates: {
    advertisementDate: '',
    applicationStartDate: '',
    applicationStartTime: '10:00',
    applicationEndDate: '',
    applicationEndTime: '23:59',
    lastDateForFee: '',
    correctionWindowStart: '',
    correctionWindowEnd: '',
    admitCardRelease: '',
    examinationDate: '',
  },
  fee: {
    generalOBCEWS: 1000,
    scStPwbdWomen: 500,
    examinationFee: 200,
    paymentModes: ['online'],
    refundPolicy: 'Non-refundable',
  },
  selection: {
    stages: [
      { stage: 1, name: 'Document Verification' },
      { stage: 2, name: 'Written Test/Screening' },
      { stage: 3, name: 'Interview/Presentation' },
    ],
    interviewMarking: {
      subjectKnowledge: 40,
      teachingSkills: 30,
      researchPublications: 20,
      generalAwareness: 10,
    },
    minimumQualifyingMarks: {
      general: 50,
      obc: 45,
      scStPwbd: 40,
    },
  },
  documents: [
    { id: '1', name: 'Recent passport-size photograph', mandatory: true, maxSize: '50 KB', format: 'JPG/PNG' },
    { id: '2', name: 'Signature', mandatory: true, maxSize: '20 KB', format: 'JPG/PNG' },
    { id: '3', name: '10th Marksheet/Certificate', mandatory: true, maxSize: '2 MB', format: 'PDF' },
    { id: '4', name: '12th Marksheet/Certificate', mandatory: true, maxSize: '2 MB', format: 'PDF' },
    { id: '5', name: 'Graduation Degree & Marksheets', mandatory: true, maxSize: '2 MB', format: 'PDF' },
    { id: '6', name: 'Post-Graduation Degree & Marksheets', mandatory: true, maxSize: '2 MB', format: 'PDF' },
    { id: '7', name: 'PhD Degree (Provisional/Final)', mandatory: false, maxSize: '2 MB', format: 'PDF' },
    { id: '8', name: 'NET/SLET Certificate', mandatory: false, maxSize: '2 MB', format: 'PDF' },
    { id: '9', name: 'Caste Certificate', mandatory: false, maxSize: '2 MB', format: 'PDF' },
    { id: '10', name: 'PwBD Certificate', mandatory: false, maxSize: '2 MB', format: 'PDF' },
    { id: '11', name: 'EWS Certificate', mandatory: false, maxSize: '2 MB', format: 'PDF' },
    { id: '12', name: 'Experience Certificates', mandatory: false, maxSize: '2 MB', format: 'PDF' },
    { id: '13', name: 'Publications/Research Papers', mandatory: false, maxSize: '2 MB', format: 'PDF' },
  ],
  advertisement: {
    notificationNumber: '',
    publishTo: {
      officialWebsite: true,
      employmentNews: true,
      newspapers: true,
      emailNotification: true,
      socialMedia: true,
    },
    newspaperDetails: {
      national: 2,
      regional: 1,
    },
  },
  description: '',
};

export const departments = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biotechnology',
  'IT & Electronics',
  'Administration',
  'Finance',
  'Human Resources',
  'Legal',
  'Research & Development',
  'Public Relations',
  'Health & Safety',
];

export const payBands = [
  'PB-1: ₹5,200-20,200',
  'PB-2: ₹9,300-34,800',
  'PB-3: ₹15,600-39,100',
  'PB-4: ₹37,400-67,000',
];

export const gradePays = [
  '₹1,800',
  '₹1,900',
  '₹2,000',
  '₹2,400',
  '₹2,800',
  '₹4,200',
  '₹4,600',
  '₹4,800',
  '₹5,400',
  '₹6,000',
  '₹6,600',
  '₹7,000',
  '₹7,600',
  '₹8,000',
  '₹8,700',
  '₹8,900',
  '₹10,000',
];

export const locations = [
  'New Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Lucknow',
  'Pune',
  'Jaipur',
  'Chandigarh',
  'Bhopal',
  'Patna',
  'Guwahati',
];
