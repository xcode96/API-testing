

export interface Resource {
  title: string;
  url: string;
}

export enum ModuleStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Theme {
  iconBg: string;
  iconColor: string;
}

export interface Module {
  id: string;
  title: string;
  subCategory?: string;
  questions: number;
  iconKey: string;
  status: ModuleStatus;
  theme: Theme;
}

export interface ModuleCategory {
  id: string;
  title: string;
  modules: Module[];
}

export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  name: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface User {
  id: number;
  fullName: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  assignedExams: string[];
  trainingStatus: 'not-started' | 'in-progress' | 'passed' | 'failed';
  lastScore: number | null;
  answers: UserAnswer[];
  moduleProgress: { [moduleId: string]: { score: number; answers: UserAnswer[] } };
  // FIX: Add optional submissionDate property for certificate generation.
  submissionDate?: number;
}

export interface AppSettings {
    githubOwner: string;
    githubRepo: string;
    githubPath: string;
    githubPat: string;
    // FIX: Add optional properties for certificate generation.
    logo?: string;
    companyFullName?: string;
    courseName?: string;
    certificationBodyText?: string;
    certificationCycleYears?: number;
    signature1?: string;
    signature1Name?: string;
    signature1Title?: string;
    signature2?: string;
    signature2Name?: string;
    signature2Title?: string;
    certificationSeal?: string;
}

// FIX: Define and export the Email interface for notification logs.
export interface Email {
  id: number;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
}
