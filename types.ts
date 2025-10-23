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
  submissionDate?: string;
  answers?: UserAnswer[];
  moduleProgress?: Record<string, ModuleStatus>;
}

export interface Email {
  id: number;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}

export interface AppSettings {
  logo: string | null;
  companyFullName: string;
  signature1: string | null;
  signature1Name: string;
  signature1Title: string;
  signature2: string | null;
  signature2Name: string;
  signature2Title: string;
  courseName: string;
  certificationBodyText: string;
  certificationSeal: string | null;
  certificationCycleYears: number;
  githubOwner?: string;
  githubRepo?: string;
  githubPath?: string;
  githubPat?: string;
}
