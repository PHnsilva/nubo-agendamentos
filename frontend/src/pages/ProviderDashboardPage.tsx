import { NuboLogo } from '../assets/svg/NuboLogo';
import { BrowserFrame } from '../components/layout/WireframeNav';
import { Icon, type IconName } from '../components/ui/Icon';

const stats: Array<{ label: string; value: string; help: string; icon: IconName }> = [
  { label: 'Solicitações', value: '3', help: 'novas', icon: 'briefcase' },
  { label: 'Agendamentos', value: '5', help: 'hoje', icon: 'calendar' },
  { label: 'Avaliação', value: '4,9', help: '(128)', icon: 'star' },
  { label: 'Ganhos', value: 'R$ 620', help: 'hoje', icon: 'wallet' },
];

const schedule = [
  { time: '09:00', client: 'João Ferreira', service: 'Instalação de disjuntor', status: 'Confirmado' },
  { time: '11:30', client: 'Rafaela Souza', service: 'Reparo elétrico', status: 'Confirmado' },
  { time: '14:00', client: 'Carlos Lima', service: 'Instalação de tomadas', status: 'Pendente' },
];

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  return (
    <article className="provider-stat-card">
      <Icon name={stat.icon} />
      <span>{stat.label}</span>
      <strong>{stat.value}</strong>
      <small>{stat.help}</small>
    </article>
  );
}

function AvailabilityPanel({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`availability-panel ${compact ? 'availability-panel--compact' : ''}`.trim()}>
      <div className="modal-title-row"><h2>Disponibilidade</h2><button type="button"><Icon name="x" /></button></div>
      {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
        <label className="toggle-row" key={day}><span>{day}</span><input type="checkbox" defaultChecked={index < 5} /><i /></label>
      ))}
      <button className="wire-cta" type="button">Salvar</button>
      {!compact && <p><Icon name="calendar" /> Você controla os dias em que está disponível para receber novas solicitações.</p>}
    </aside>
  );
}

function ProviderDashboardPhone() {
  return (
    <div className="phone-shell dashboard-phone">
      <div className="phone-status"><span>9:41</span><i /><span>▴ ◔ ▰</span></div>
      <div className="phone-screen-content">
        <div className="phone-dashboard-head"><div><h2>Olá, Marcos 👋</h2><p>Eletricista</p></div><span className="avatar-placeholder"><Icon name="user" /></span></div>
        <h3>Resumo do dia</h3>
        <div className="provider-stats-grid phone-stats-grid">{stats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</div>
        <h3>Atalhos</h3>
        <div className="shortcut-list"><button type="button"><Icon name="calendar" /> Agenda de hoje <Icon name="arrowRight" /></button><button type="button"><Icon name="plug" /> Ações rápidas <Icon name="arrowRight" /></button></div>
      </div>
    </div>
  );
}

export function ProviderDashboardPage() {
  return (
    <main className="wire-page provider-dashboard-page">
      <div className="desktop-wire-heading desktop-only-title"><strong>Wireframe 05 — <span>Painel do Prestador Desktop</span></strong></div>
      <div className="mobile-wire-label">Wireframe 05 — Painel do Prestador</div>

      <BrowserFrame className="provider-dashboard-desktop-frame">
        <section className="provider-dashboard-desktop-layout">
          <aside className="provider-sidebar">
            <NuboLogo />
            {['Resumo do dia', 'Agenda', 'Solicitações', 'Avaliações', 'Ganhos', 'Mensagens', 'Configurações'].map((item, index) => (
              <button className={index === 0 ? 'active' : ''} type="button" key={item}><Icon name={index === 0 ? 'calendar' : index === 1 ? 'calendar' : index === 2 ? 'briefcase' : index === 3 ? 'star' : index === 4 ? 'wallet' : index === 5 ? 'message' : 'sliders'} /> {item}</button>
            ))}
            <button className="logout-button" type="button"><Icon name="arrowRight" /> Sair</button>
          </aside>
          <section className="provider-dashboard-main">
            <div className="provider-topbar"><div><h1>Olá, Marcos 👋</h1><p>Eletricista</p></div><div><Icon name="bell" /><span className="avatar-placeholder"><Icon name="user" /></span></div></div>
            <div className="provider-stats-grid">{stats.slice(0, 3).map((stat) => <StatCard stat={stat} key={stat.label} />)}</div>
            <article className="today-agenda-card">
              <div className="section-line-title"><h2>Agenda de hoje</h2><button type="button">Ver agenda completa <Icon name="arrowRight" /></button></div>
              {schedule.map((item) => (
                <div className="schedule-row" key={item.time}><time>{item.time}</time><span /><div><strong>{item.client}</strong><p>{item.service}<br />Vila Mariana, São Paulo - SP</p></div><b className={item.status === 'Pendente' ? 'pending' : ''}>{item.status}</b></div>
              ))}
              <button className="agenda-more" type="button">Ver todos os agendamentos <Icon name="chevronDown" /></button>
            </article>
          </section>
          <AvailabilityPanel />
        </section>
      </BrowserFrame>

      <section className="mobile-dashboard-layout">
        <NuboLogo />
        <h1>Resumo rápido do seu dia</h1>
        <div className="mobile-dashboard-compose"><ProviderDashboardPhone /><AvailabilityPanel compact /></div>
        <p className="mobile-bottom-note"><Icon name="shield" /> Mais organização, mais clientes, <span>mais controle.</span></p>
      </section>
    </main>
  );
}
