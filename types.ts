import { ReactNode } from 'react';

export enum ModuleStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
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

export interface Module {
  id: string;
  title: string;
  questions: number;
  iconKey: string;
  status: ModuleStatus;
  theme: {
    iconBg: string;
    iconColor: string;
  };
  subCategory?: string;
}

export interface ModuleCategory {
  id: string;
  title: string;
  modules: Module[];
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
  password?: string;
  trainingStatus: 'not-started' | 'in-progress' | 'passed' | 'failed';
  lastScore?: number | null;
  role: 'user' | 'admin';
  assignedExams?: string[];
  answers?: UserAnswer[];
  moduleProgress?: Record<string, ModuleStatus>;
  // FIX: Added missing submissionDate property for certificate generation.
  submissionDate?: number;
}

// FIX: Added missing AppSettings type for certificate and GitHub settings.
export interface AppSettings {
    companyFullName: string;
    courseName: string;
    certificationBodyText: string;
    certificationCycleYears: number;
    logo?: string;
    signature1?: string;
    signature1Name?: string;
    signature1Title?: string;
    signature2?: string;
    signature2Name?: string;
    signature2Title?: string;
    certificationSeal?: string;
    githubPat: string;
    githubOwner: string;
    githubRepo: string;
    githubPath: string;
}

// FIX: Added missing Email type for notification logs.
export interface Email {
    id: number;
    to: string;
    subject: string;
    body: string;
    timestamp: number;
}
