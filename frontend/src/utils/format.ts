import type { ApplicationStatus, AppointmentStatus } from '../types/api';

export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  AJUSTE_SOLICITADO: 'Ajuste solicitado',
  APROVADO: 'Aprovado',
  PENDENTE: 'Pendente',
  REJEITADO: 'Rejeitado',
};

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  CANCELADO: 'Cancelado',
  CONCLUIDO: 'Concluído',
  CONFIRMADO: 'Confirmado',
  RECUSADO: 'Recusado',
  SOLICITADO: 'Solicitado',
};

export const dayLabel: Record<string, string> = {
  MONDAY: 'Segunda',
  TUESDAY: 'Terça',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function shortTime(value: string) {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

export function statusTone(status: AppointmentStatus): 'neutral' | 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'CONFIRMADO' || status === 'CONCLUIDO') return 'success';
  if (status === 'RECUSADO' || status === 'CANCELADO') return 'danger';
  if (status === 'SOLICITADO') return 'warning';
  return 'neutral';
}
