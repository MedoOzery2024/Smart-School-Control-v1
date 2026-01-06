import { SchoolStage, UserRole, User, SchoolType } from './types';

export const APP_NAME = "Smart School Control (SSC)";
export const DEVELOPER_NAME = "محمود محمد محمود أبو الفتوح أحمد العزيري";

export const WEEK_DAYS = [
  'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'
];

export const PERIODS = [
  { id: 1, label: 'الحصة الأولى', start: '08:00', end: '08:45' },
  { id: 2, label: 'الحصة الثانية', start: '08:50', end: '09:35' },
  { id: 3, label: 'الحصة الثالثة', start: '09:40', end: '10:25' },
  { id: 4, label: 'الحصة الرابعة', start: '10:45', end: '11:30' },
  { id: 5, label: 'الحصة الخامسة', start: '11:35', end: '12:20' },
  { id: 6, label: 'الحصة السادسة', start: '12:25', end: '01:10' },
];

// Mock Initial Data - Cleared for production feel
export const MOCK_SCHOOL = {
  id: 'sch_01',
  name: 'مدرسة جديدة',
  type: SchoolType.GOVERNMENT,
};

export const MOCK_USERS: User[] = [];

export const SUBJECTS = [
  'اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'الحاسب الآلي', 'التربية الدينية'
];