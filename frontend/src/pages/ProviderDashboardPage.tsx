import { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { Appointment, AvailabilityBlock, ServiceOffering } from '../types/api';
import { appointmentStatusLabel, currency, dayLabel, shortTime, statusTone } from '../utils/format';

export function ProviderDashboardPage() {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiClient.getProviderServices(), apiClient.getMyAppointments(), apiClient.getProviderAvailability()])
      .then(([serviceData, appointmentData, availabilityData]) => {
        setServices(serviceData);
        setAppointments(appointmentData);
        setAvailability(availabilityData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar o painel.'));
  }, []);

  async function updateAppointment(id: string, action: 'confirm' | 'reject') {
    try {
      setError('');
      const updated = action === 'confirm'
        ? await apiClient.confirmAppointment(id)
        : await apiClient.rejectAppointment(id, 'Recusado pelo painel do prestador.');
      setAppointments((current) => current.map((appointment) => appointment.id === id ? updated : appointment));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o agendamento.');
    }
  }

  return (
    <section className="page-shell">
      <div className="section-heading align-left">
        <span className="eyebrow">Painel do prestador</span>
        <h1>Serviços, agenda e solicitações.</h1>
        <p>Cards operacionais para acompanhar o que está publicado e responder clientes.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><strong>{services.length}</strong><span>Serviços ativos</span></div>
        <div className="stat-card"><strong>{availability.length}</strong><span>Blocos de agenda</span></div>
        <div className="stat-card"><strong>{appointments.filter((item) => item.status === 'SOLICITADO').length}</strong><span>Solicitações</span></div>
        <div className="stat-card"><strong>{appointments.filter((item) => item.status === 'CONFIRMADO').length}</strong><span>Confirmados</span></div>
      </div>

      {error && <p className="notice error">{error}</p>}
      <div className="dashboard-grid">
        <section>
          <div className="section-heading align-left">
            <span className="eyebrow">Catálogo</span>
            <h2>Serviços ativos</h2>
          </div>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <span className="icon-pill"><Icon name="briefcase" /></span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <strong>{currency.format(service.basePrice)} · {service.estimatedDurationMinutes} min</strong>
              </article>
            ))}
            {services.length === 0 && <p className="notice">Nenhum serviço ativo encontrado.</p>}
          </div>
        </section>

        <section>
          <div className="section-heading align-left">
            <span className="eyebrow">Disponibilidade</span>
            <h2>Agenda publicada</h2>
          </div>
          <div className="schedule-grid">
            {availability.map((block) => (
              <article className="schedule-card" key={`${block.dayOfWeek}-${block.startTime}`}>
                <span className="icon-pill amber"><Icon name="clock" /></span>
                <strong>{dayLabel[block.dayOfWeek] ?? block.dayOfWeek}</strong>
                <span>{shortTime(block.startTime)} às {shortTime(block.endTime)}</span>
              </article>
            ))}
            {availability.length === 0 && <p className="notice">Nenhum bloco de agenda publicado.</p>}
          </div>
        </section>
      </div>

      <section className="section-band">
        <div className="section-heading align-left">
          <span className="eyebrow">Solicitações recebidas</span>
          <h2>Responder agendamentos</h2>
        </div>
        <div className="table-list compact-list">
          {appointments.map((appointment) => (
            <article className="row-card" key={appointment.id}>
              <div className="appointment-line">
                <span className="icon-pill coral"><Icon name="calendar" /></span>
                <div>
                  <h3>{appointment.clientName}</h3>
                  <p>{appointment.serviceName} · {appointment.scheduledDate} às {shortTime(appointment.startTime)}</p>
                </div>
              </div>
              <Badge tone={statusTone(appointment.status)}>{appointmentStatusLabel[appointment.status]}</Badge>
              {appointment.status === 'SOLICITADO' && (
                <div className="quick-actions">
                  <button className="secondary-button compact" type="button" onClick={() => updateAppointment(appointment.id, 'confirm')}>
                    <Icon name="check" />
                    Confirmar
                  </button>
                  <button className="ghost-button compact" type="button" onClick={() => updateAppointment(appointment.id, 'reject')}>
                    <Icon name="x" />
                    Recusar
                  </button>
                </div>
              )}
            </article>
          ))}
          {appointments.length === 0 && <p className="notice">Nenhuma solicitação recebida.</p>}
        </div>
      </section>
    </section>
  );
}
