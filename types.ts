export enum UserRole {
  ADMIN = 'ADMIN', // مدير المدرسة (صلاحيات كاملة + حذف المدرسة)
  IT = 'IT', // مسؤول تقني (إدارة الحسابات وكلمات المرور)
  CONTROL = 'CONTROL', // شؤون الكنترول (رصد درجات وشهادات)
  TEACHER = 'TEACHER', // معلم (رفع مواد، امتحانات، جداول)
  STUDENT = 'STUDENT', // طالب (عرض نتائج، حل امتحانات)
  STAFF = 'STAFF' // موظف إداري عام
}

export enum SchoolStage {
  KG = 'KG', // رياض أطفال
  PRIMARY = 'PRIMARY', // ابتدائي
  PREP = 'PREP', // إعدادي
  SECONDARY = 'SECONDARY' // ثانوي
}

export enum SchoolType {
  GOVERNMENT = 'GOVERNMENT',
  LANGUAGE = 'LANGUAGE',
  EXPERIMENTAL = 'EXPERIMENTAL',
  INTERNATIONAL = 'INTERNATIONAL'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  schoolId: string;
  stage?: SchoolStage;
  gradeLevel?: string;
  password?: string; // For mock purposes of reset
}

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  logoUrl?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'IMAGE';
  url: string; // Mock URL
  uploadDate: string;
  teacherId: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  stage: SchoolStage;
  gradeLevel: string;
  term: 'FIRST' | 'SECOND' | 'FULL';
  totalMarks: number;
  date: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface StudentResult {
  studentId: string;
  examId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE' | 'FAIL';
  status: 'PASS' | 'FAIL';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT';
  time: string;
  read: boolean;
}

export type ViewState = 
  | 'LOGIN' 
  | 'DASHBOARD' 
  | 'USERS' 
  | 'SCHEDULE' 
  | 'ATTENDANCE'
  | 'EXAMS' 
  | 'AI_GENERATOR' 
  | 'RESULTS' 
  | 'CERTIFICATES'
  | 'TEACHER_STATS'
  | 'STUDY_MATERIALS' // New section
  | 'SETTINGS';