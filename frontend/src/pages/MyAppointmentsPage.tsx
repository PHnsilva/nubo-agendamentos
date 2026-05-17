import { Link } from 'react-router-dom';
import { NuboLogo } from '../assets/svg/NuboLogo';
import { BrowserFrame, WireframeNav } from '../components/layout/WireframeNav';
import { Icon, type IconName } from '../components/ui/Icon';

const appointments: Array<{ service: string; provider: string; date: string; time: string; icon: IconName; past?: boolean }> = [
  { service: 'Elétrica', provider: 'Marcos Silva', date: '23/05/2024', time: '14:00', icon: 'plug' },
  { service: 'Hidráulica', provider: 'Marcos Silva', date: '10/05/2024', time: '10:00', icon: 'droplet' },
  { service: 'Pintura', provider: 'João Ferreira', date: '18/05/2024', time: '09:00', icon: 'paint' },
  { service: 'Montagem', provider: 'Rafaela Souza', date: '02/05/2024', time: '16:00', icon: 'tools', past: true },
];

function AppointmentRow({ item, compact = false }: { item: (typeof appointments)[number]; compact?: boolean }) {
  return (
    <article className={`appointment-row ${item.past ? 'is-past' : ''} ${compact ? 'appointment-row--compact' : ''}`.trim()}>
      <span className="service-icon"><Icon name={item.icon} /></span>
      <div className="appointment-main"><h3>{item.service}</h3><p>{item.provider}</p><span className="verified"><Icon name="shield" /> Verificado</span></div>
      <div className="appointment-meta"><Icon name="calendar" /><small>Data</small><strong>{item.date}</strong></div>
      <div className="appointment-meta"><Icon name="clock" /><small>Horário</small><strong>{item.time}</strong></div>
      <button className="wire-button wire-button--ghost" type="button">Ver</button>
      {!item.past && <button className="wire-cta wire-cta--small" type="button">Reagendar</button>}
    </article>
  );
}

function RescheduleModal({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`reschedule-card ${compact ? 'reschedule-card--compact' : ''}`.trim()}>
      <div className="modal-title-row"><h2>Reagendar</h2><button type="button"><Icon name="x" /></button></div>
      <h3>Escolha a data</h3>
      <div className="chip-selector">{['22\nMai', '23\nMai', '24\nMai', '25\nMai', '26\nMai'].map((date, index) => <button className={index === 1 ? 'active' : ''} type="button" key={date}>{date.split('\n').map((line) => <span key={line}>{line}</span>)}</button>)}</div>
      <h3>Escolha o horário</h3>
      <div className="time-selector">{['08:00', '10:00', '14:00', '16:00'].map((time) => <button className={time === '14:00' ? 'active' : ''} type="button" key={time}>{time}</button>)}</div>
      <div className="modal-actions"><button className="wire-button wire-button--ghost" type="button">Cancelar</button><button className="wire-cta wire-cta--small" type="button">Confirmar</button></div>
    </aside>
  );
}

function AppointmentsPhonePreview() {
  return (
    <div className="phone-shell appointments-phone">
      <div className="phone-status"><span>9:41</span><i /><span>▴ ◔ ▰</span></div>
      <div className="phone-screen-content">
        <div className="phone-app-header"><Icon name="menu" /><NuboLogo /><Icon name="bell" /></div>
        <div className="tabs"><button className="active" type="button">Próximos</button><button type="button">Passados</button></div>
        <AppointmentRow item={appointments[0]} compact />
        <AppointmentRow item={appointments[1]} compact />
      </div>
    </div>
  );
}

export function MyAppointmentsPage() {
  return (
    <main className="wire-page appointments-page">
      <div className="desktop-wire-heading desktop-only-title"><strong>Wireframe 04 — <span>Meus Agendamentos Desktop</span></strong></div>
      <div className="mobile-wire-label">Wireframe 04 — Meus Agendamentos</div>

      <BrowserFrame className="appointments-desktop-frame">
        <WireframeNav />
        <section className="appointments-desktop-layout">
          <div className="appointments-list-area">
            <h1>Meus Agendamentos</h1>
            <div className="tabs"><button className="active" type="button">Próximos</button><button type="button">Passados</button></div>
            <h2>Próximos agendamentos</h2>
            {appointments.slice(0, 3).map((item) => <AppointmentRow item={item} key={`${item.service}-${item.date}`} />)}
            <h2>Agendamentos passados</h2>
            <AppointmentRow item={appointments[3]} />
          </div>
          <RescheduleModal />
        </section>
      </BrowserFrame>

      <section className="mobile-appointments-layout">
        <NuboLogo />
        <h1>Acompanhe e reagende seus serviços</h1>
        <div className="mobile-appointment-compose">
          <AppointmentsPhonePreview />
          <RescheduleModal compact />
        </div>
      </section>
    </main>
  );
}
