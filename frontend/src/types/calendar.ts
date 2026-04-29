// types/calendar.ts — canonical event model for CivicTask Pro

export type EventType =
  | 'study'
  | 'exam'
  | 'mock'
  | 'revision'
  | 'answer_writing'
  | 'personal';

export type Subject =
  | 'GS I' | 'GS II' | 'GS III' | 'GS IV'
  | 'Essay' | 'CSAT' | 'Optional' | 'Current Affairs' | 'Personal';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  subject?: Subject;
  startDate: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:MM 24h
  endTime: string;   // HH:MM 24h
  notes?: string;
  color: string;     // CSS background color
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export const EVENT_TYPE_META: Record<EventType, { label: string; color: string; bg: string }> = {
  study:          { label: 'Study Session',    color: '#6C63FF', bg: 'rgba(108,99,255,0.25)' },
  exam:           { label: 'UPSC Exam Date',   color: '#C9A84C', bg: 'rgba(201,168,76,0.25)' },
  mock:           { label: 'Mock Test',        color: '#0D9488', bg: 'rgba(13,148,136,0.25)' },
  revision:       { label: 'Revision Block',   color: '#D97706', bg: 'rgba(217,119,6,0.25)'  },
  answer_writing: { label: 'Answer Writing',   color: '#DB2777', bg: 'rgba(219,39,119,0.25)' },
  personal:       { label: 'Personal / Other', color: '#64748B', bg: 'rgba(100,116,139,0.25)'},
};

export const SUBJECT_OPTIONS: Subject[] = [
  'GS I', 'GS II', 'GS III', 'GS IV', 'Essay', 'CSAT', 'Optional', 'Current Affairs', 'Personal',
];
