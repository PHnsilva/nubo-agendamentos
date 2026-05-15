import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../app/providers';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { ProviderDetail } from '../types/api';
import { appointmentStatusLabel, currency, dayLabel, initials, shortTime } from '../utils/format';

function todayForInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export function ProviderProfilePage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [error, setError] = useState('');
  const [serviceOfferingId, setServiceOfferingId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(todayForInput());
  const [startTime, setStartTime] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [status, setStatus] = useState('');
  const minDate = useMemo(todayForInput, []);

  useEffect(() => {
    if (!id) return;
    apiClient.getProvider(id)
      .then((data) => {
        setProvider(data);
        setServiceOfferingId(data.services[0]?.id ?? '');
        setStartTime(shortTime(data.availability[0]?.startTime ?? ''));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Prestador não encontrado.'));
  }, [id]);

  async function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!provider) return;
    if (!isAuthenticated) {
      setStatus('Entre para solicitar um horário.');
      return;
    }
    if (user?.role === 'MODERADOR') {
      setStatus('Moderadores não solicitam agendamentos. Use uma conta cliente.');
      return;
    }
    try {
      const appointment = await apiClient.requestAppointment({
        providerId: provider.id,
        serviceOfferingId,
        scheduledDate,
        startTime: shortTime(startTime),
        clientNote,
      });
      setStatus(`Solicitação enviada: ${appointmentStatusLabel[appointment.status]}.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Entre para solicitar um horário.');
    }
  }

  if (error) return <section className="page-shell"><p className="notice error">{error}</p></section>;
  if (!provider) return <section className="page-shell"><p className="notice">Carregando perfil...</p></section>;

  return (
    <section className="page-shell profile-page">
      <div className="profile-header">
        {provider.profileImageUrl ? (
          <img className="avatar-image large" src={provider.profileImageUrl} alt="" />
        ) : (
          <div className="avatar-placeholder large" aria-hidden="true">{initials(provider.publicName)}</div>
        )}
        <div>
          <span className="eyebrow">{provider.city} · {provider.regions.join(', ')}</span>
          <h1>{provider.publicName}</h1>
          <p>{provider.description}</p>
          <div className="chip-row">
            {provider.categories.map((category) => <span className="chip coral" key={category}>{category}</span>)}
          </div>
        </div>
        <div className="meta-grid">
          <span className="metric-line"><Icon name="star" />{provider.ratingAverage.toFixed(1)} · {provider.ratingCount} avaliações</span>
          <span className="metric-line"><Icon name="wallet" />A partir de {currency.format(provider.basePriceFrom)}</span>
          <span className="metric-line"><Icon name="phone" />{provider.whatsapp || provider.contactPhone}</span>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-stack">
          <section>
            <div className="section-heading align-left">
              <span className="eyebrow">Serviços</span>
              <h2>Opções publicadas pelo prestador</h2>
            </div>
            <div className="service-list">
              {provider.services.map((service) => (
                <article className="service-card" key={service.id}>
                  <span className="icon-pill"><Icon name="briefcase" /></span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <strong>{currency.format(service.basePrice)} · {service.estimatedDurationMinutes} min</strong>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="section-heading align-left">
              <span className="eyebrow">Agenda disponível</span>
              <h2>Blocos semanais para solicitar atendimento</h2>
            </div>
            <div className="schedule-grid">
              {provider.availability.map((block) => (
                <article className="schedule-card" key={`${block.dayOfWeek}-${block.startTime}`}>
                  <span className="icon-pill amber"><Icon name="clock" /></span>
                  <strong>{dayLabel[block.dayOfWeek] ?? block.dayOfWeek}</strong>
                  <span>{shortTime(block.startTime)} às {shortTime(block.endTime)}</span>
                </article>
              ))}
              {provider.availability.length === 0 && <p className="notice">Este prestador ainda não publicou horários.</p>}
            </div>
          </section>

          <section>
            <div className="section-heading align-left">
              <span className="eyebrow">Portfólio</span>
              <h2>Fotos e referências</h2>
            </div>
            <div className="portfolio-grid">
              {(provider.portfolioImageUrls.length ? provider.portfolioImageUrls : ['placeholder']).slice(0, 3).map((image, index) => (
                <div className="portfolio-tile" key={`${image}-${index}`}>
                  {image === 'placeholder' ? <Icon name="spark" /> : <img src={image} alt="" />}
                </div>
              ))}
            </div>
          </section>
        </div>

        <form className="surface-panel appointment-form" onSubmit={submitAppointment}>
          <span className="icon-pill coral"><Icon name="calendar" /></span>
          <h2>Solicitar agendamento</h2>
          {!isAuthenticated && <p className="notice">Você precisa entrar para enviar a solicitação.</p>}
          {user?.role === 'MODERADOR' && <p className="notice">Moderadores podem analisar candidaturas, mas não solicitam horários por esta tela.</p>}
          <label>
            Serviço
            <select value={serviceOfferingId} onChange={(event) => setServiceOfferingId(event.target.value)} required>
              {provider.services.map((service) => (
                <option value={service.id} key={service.id}>{service.name}</option>
              ))}
            </select>
          </label>
          <label>
            Data
            <input type="date" min={minDate} value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required />
          </label>
          <label>
            Horário
            <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
          </label>
          <label>
            Observação
            <textarea value={clientNote} onChange={(event) => setClientNote(event.target.value)} rows={4} placeholder="Conte o contexto do atendimento" />
          </label>
          {isAuthenticated ? (
            <button className="primary-button" disabled={user?.role === 'MODERADOR'} type="submit">
              Solicitar horário
              <Icon name="arrowRight" />
            </button>
          ) : (
            <Link className="primary-button" to="/login">
              Entrar para solicitar
              <Icon name="arrowRight" />
            </Link>
          )}
          {status && (
            <p className={status.includes('enviada') ? 'notice' : 'notice error'}>
              {status} {!isAuthenticated && <Link className="muted-link" to="/login">Entrar</Link>}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
