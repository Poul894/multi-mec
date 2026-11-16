import { urgenciaDe } from './jobs';
import type { Job, Urgencia } from './jobs';

export interface CalendarCell {
  day: number;
  dateKey: string;
  jobs: Job[];
  urgenciaCell: Urgencia | 'vacio';
}

export interface MonthCalendar {
  cells: (CalendarCell | null)[];
  monthLabel: string;
  prevMes: string;
  nextMes: string;
  weekdayLabels: string[];
}

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function monthKey(year: number, month1based: number): string {
  return `${year}-${pad2(month1based)}`;
}

/** Lee `?mes=YYYY-MM`; si no viene o es inválido, usa el mes actual. */
export function resolveMes(mesParam: string | null): { year: number; month: number } {
  if (mesParam && /^\d{4}-\d{2}$/.test(mesParam)) {
    const [year, month] = mesParam.split('-').map(Number);
    return { year, month };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function cellUrgencia(jobs: Job[]): Urgencia | 'vacio' {
  if (jobs.length === 0) return 'vacio';
  const estados = jobs.map((job) => urgenciaDe(job));
  if (estados.includes('urgente')) return 'urgente';
  if (estados.includes('en-plazo')) return 'en-plazo';
  return 'entregado';
}

export function buildMonthCalendar(jobs: Job[], year: number, month: number): MonthCalendar {
  const monthIndex = month - 1;
  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingOffset = (firstOfMonth.getDay() + 6) % 7; // la semana arranca lunes

  const prevMes = monthIndex === 0 ? monthKey(year - 1, 12) : monthKey(year, monthIndex);
  const nextMes = monthIndex === 11 ? monthKey(year + 1, 1) : monthKey(year, monthIndex + 2);

  const jobsByDay = new Map<string, Job[]>();
  for (const job of jobs) {
    const list = jobsByDay.get(job.fecha_entrega) ?? [];
    list.push(job);
    jobsByDay.set(job.fecha_entrega, list);
  }

  const cells: (CalendarCell | null)[] = [];
  for (let i = 0; i < leadingOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = `${year}-${pad2(month)}-${pad2(day)}`;
    const dayJobs = jobsByDay.get(dateKey) ?? [];
    cells.push({ day, dateKey, jobs: dayJobs, urgenciaCell: cellUrgencia(dayJobs) });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = firstOfMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  return { cells, monthLabel, prevMes, nextMes, weekdayLabels: WEEKDAY_LABELS };
}
