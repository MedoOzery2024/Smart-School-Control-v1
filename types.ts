export enum UserRole {
  ADMIN = 'ADMIN', // مدير المدرسة
  TEACHER = 'TEACHER', // معلم
  STUDENT = 'STUDENT', // طالب
  STAFF = 'STAFF', // إداري
  IT = 'IT' // مسؤول تقني
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
  stage?: SchoolStage; // For students/teachers
  gradeLevel?: string; // e.g., "الصف الأول"
}

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  logoUrl?: string;
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
  correctAnswer: number; // Index 0-3
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

export interface ScheduleItem {
  day: string;
  period: number; // 1 to 8
  subject: string;
  teacherId: string;
  startTime: string;
  endTime: string;
}

export type ViewState = 
  | 'LOGIN' 
  | 'DASHBOARD' 
  | 'USERS' 
  | 'SCHEDULE' 
  | 'EXAMS' 
  | 'AI_GENERATOR' 
  | 'RESULTS' 
  | 'CERTIFICATES'
  | 'TEACHER_STATS'
  | 'SETTINGS';
