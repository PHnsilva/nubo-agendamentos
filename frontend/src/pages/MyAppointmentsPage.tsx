import { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { Appointment } from '../types/api';
import { appointmentStatusLabel, shortTime, statusTone } from '../utils/format';

export function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.getMyAppointments()
      .then(setAppointments)
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar agendamentos.'));
  }, []);

  return (
    <section className="page-shell">
      <div className="section-heading align-left">
        <span className="eyebrow">Meus agendamentos</span>
        <h1>Acompanhe solicitações e confirmações.</h1>
        <p>Veja o status de cada pedido e o horário combinado com o prestador.</p>
      </div>
      {error && <p className="notice error">{error}</p>}
      <div className="table-list">
        {appointments.map((appointment) => (
          <article className="row-card" key={appointment.id}>
            <div className="appointment-line">
              <span className="icon-pill coral"><Icon name="calendar" /></span>
              <div>
                <h2>{appointment.serviceName}</h2>
                <p>{appointment.providerPublicName} · {appointment.scheduledDate} às {shortTime(appointment.startTime)}</p>
              </div>
            </div>
            <Badge tone={statusTone(appointment.status)}>{appointmentStatusLabel[appointment.status]}</Badge>
          </article>
        ))}
        {!error && appointments.length === 0 && (
          <div className="surface-panel empty-state">
            <Icon name="calendar" />
            <h2>Nenhum agendamento registrado</h2>
            <p>Escolha um prestador aprovado para solicitar seu primeiro horário.</p>
          </div>
        )}
      </div>
    </section>
  );
}
