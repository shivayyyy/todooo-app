// lib/calendarUtils.ts — date/time helpers

/** Format a Date → 'YYYY-MM-DD' */
export const fmtDate = (d: Date): string => d.toISOString().split('T')[0];

/** Parse 'YYYY-MM-DD' → Date (local midnight) */
export const parseDate = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** 'HH:MM' → minutes since midnight */
export const timeToMins = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/** minutes since midnight → 'HH:MM' */
export const minsToTime = (mins: number): string => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/** 'HH:MM' → '10:30 AM' display */
export const fmt12 = (t: string): string => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/** Return the Monday of the week containing `date` */
export const weekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Return array of 7 dates for the week containing `anchor` */
export const weekDays = (anchor: Date): Date[] => {
  const mon = weekStart(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(d.getDate() + i);
    return d;
  });
};

/** Return first day of month */
export const monthStart = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

/** Return array of Date objects for full 6-week calendar grid */
export const monthGridDays = (anchor: Date): Date[] => {
  const ms = monthStart(anchor);
  const startDow = ms.getDay() === 0 ? 6 : ms.getDay() - 1; // Mon=0
  const start = new Date(ms);
  start.setDate(start.getDate() - startDow);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
};

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isToday = (d: Date): boolean => isSameDay(d, new Date());
