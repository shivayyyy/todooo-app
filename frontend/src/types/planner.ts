// types/planner.ts
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'deferred';
export type GSubject = 'GS I' | 'GS II' | 'GS III' | 'GS IV' | 'Essay' | 'CSAT' | 'Optional' | 'Current Affairs' | 'Personal';

export interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject?: GSubject;
  topic?: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  status: TaskStatus;
  subtasks: SubTask[];
  notes?: string;
  createdAt: string; // ISO
  completedAt?: string;
  linkedEventId?: string;
}

export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  high:     { label: 'High',     color: '#D97706', bg: 'rgba(217,119,6,0.15)'  },
  medium:   { label: 'Medium',   color: '#6C63FF', bg: 'rgba(108,99,255,0.15)' },
  low:      { label: 'Low',      color: '#64748B', bg: 'rgba(100,116,139,0.15)'},
};

export const STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  todo:        { label: 'To Do',       color: '#A0AEC0' },
  in_progress: { label: 'In Progress', color: '#6C63FF' },
  done:        { label: 'Done',        color: '#10B981' },
  deferred:    { label: 'Deferred',    color: '#64748B' },
};

export const SUBJECT_COLOR: Record<GSubject, string> = {
  'GS I':           '#7C3AED',
  'GS II':          '#0369A1',
  'GS III':         '#047857',
  'GS IV':          '#9D174D',
  'Essay':          '#D97706',
  'CSAT':           '#0D9488',
  'Optional':       '#3730A3',
  'Current Affairs':'#C9A84C',
  'Personal':       '#64748B',
};

export const SUBJECTS: GSubject[] = [
  'GS I', 'GS II', 'GS III', 'GS IV', 'Essay', 'CSAT', 'Optional', 'Current Affairs', 'Personal',
];
