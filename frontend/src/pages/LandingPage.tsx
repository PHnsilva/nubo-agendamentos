import { Link } from 'react-router-dom';
import { NuboLogo } from '../assets/svg/NuboLogo';
import { BrowserFrame, WireframeNav } from '../components/layout/WireframeNav';
import { Icon, type IconName } from '../components/ui/Icon';

const categories: Array<{ label: string; icon: IconName }> = [
  { label: 'Elétrica', icon: 'plug' },
  { label: 'Hidráulica', icon: 'droplet' },
  { label: 'Pintura', icon: 'paint' },
  { label: 'Montagem', icon: 'tools' },
  { label: 'Limpeza', icon: 'spark' },
];

const providers = [
  { name: 'Marcos Silva', role: 'Eletricista', rating: '4,9', price: 'R$ 120' },
  { name: 'João Ferreira', role: 'Encanador', rating: '4,8', price: 'R$ 110' },
  { name: 'Rafaela Souza', role: 'Montadora', rating: '4,8', price: 'R$ 100' },
];

const steps: Array<{ title: string; text: string; icon: IconName }> = [
  { title: 'Encontre', text: 'Busque profissionais perto de você.', icon: 'location' },
  { title: 'Agende', text: 'Escolha data e horário.', icon: 'calendar' },
  { title: 'Receba', text: 'Combine o serviço com segurança.', icon: 'message' },
  { title: 'Avalie', text: 'Ajude outros clientes.', icon: 'shield' },
];

function ProviderMiniCard({ provider }: { provider: (typeof providers)[number] }) {
  return (
    <article className="provider-mini-card">
      <span className="avatar-placeholder" aria-hidden="true"><Icon name="user" /></span>
      <div>
        <h3>{provider.name}</h3>
        <p>{provider.role}</p>
        <span className="stars">★★★★★ <b>{provider.rating}</b></span>
        <span className="verified"><Icon name="shield" /> Verificado</span>
      </div>
      <div className="provider-mini-card__side">
        <small>A partir de</small>
        <strong>{provider.price}</strong>
        <Link to="/prestadores" className="wire-button wire-button--ghost">Ver perfil</Link>
      </div>
    </article>
  );
}

function ClientPhonePreview() {
  return (
    <div className="phone-shell landing-phone" aria-label="Prévia mobile do Nubo">
      <div className="phone-status"><span>9:41</span><i /><span>▴ ◔ ▰</span></div>
      <div className="phone-screen-content">
        <button className="location-chip" type="button"><Icon name="location" /> São Paulo, SP <Icon name="chevronDown" /></button>
        <div className="phone-search"><Icon name="search" /><span>Buscar serviço...</span></div>
        <article className="phone-provider-card">
          <span className="avatar-placeholder"><Icon name="user" /></span>
          <div>
            <h3>Marcos Silva</h3>
            <p>Eletricista</p>
            <span className="stars">★★★★★ <b>4,9</b></span>
            <span className="verified"><Icon name="shield" /> Verificado</span>
          </div>
          <Icon className="bookmark" name="bookmark" />
        </article>
        <h3 className="phone-section-title">Serviços populares</h3>
        <div className="phone-category-row">
          {categories.slice(0, 3).map((item) => (
            <div className="phone-category" key={item.label}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <h3 className="phone-section-title">Agende com facilidade</h3>
        <div className="date-time-grid">
          <div><Icon name="calendar" /><small>Data</small><strong>23/05/2024</strong></div>
          <div><Icon name="clock" /><small>Horário</small><strong>14:00</strong></div>
        </div>
        <button className="wire-button wire-button--navy phone-full" type="button">Confirmar agendamento</button>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="wire-page landing-page">
      <div className="mobile-wire-label">Wireframe 01 — Landing Mobile</div>
      <div className="desktop-wire-heading">
        <NuboLogo />
        <strong>Wireframe 01 — <span>Landing Desktop</span></strong>
      </div>

      <BrowserFrame className="landing-desktop-frame">
        <WireframeNav />
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <h1>Encontre prestadores perto de você com <span>praticidade e confiança</span></h1>
            <p>Conectamos você aos melhores profissionais de serviços para sua casa ou empresa.</p>
          </div>
          <div className="map-visual" aria-hidden="true"><span /></div>
        </section>

        <section className="desktop-search-bar" aria-label="Busca de serviços">
          <button type="button"><Icon name="location" /> São Paulo, SP <Icon name="chevronDown" /></button>
          <label><Icon name="search" /><span>Que serviço você precisa?</span></label>
          <Link to="/prestadores" className="wire-cta"><Icon name="search" /> Buscar serviços</Link>
        </section>

        <section className="wire-section compact-section">
          <div className="section-line-title"><h2>Categorias populares</h2><Link to="/prestadores">Ver todas <Icon name="arrowRight" /></Link></div>
          <div className="category-grid desktop-categories">
            {categories.map((item) => (
              <Link to="/prestadores" className="category-card" key={item.label}>
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="wire-section compact-section">
          <div className="section-line-title"><h2>Prestadores em destaque</h2><Link to="/prestadores">Ver todos <Icon name="arrowRight" /></Link></div>
          <div className="provider-grid landing-provider-grid">
            {providers.map((provider) => <ProviderMiniCard provider={provider} key={provider.name} />)}
          </div>
        </section>

        <section className="wire-section compact-section">
          <h2>Como funciona</h2>
          <div className="steps-row">
            {steps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span>{index + 1}</span>
                <Icon name={step.icon} />
                <div><strong>{step.title}</strong><p>{step.text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="wire-section testimonials-row">
          {['Atendimento rápido e preço justo!', 'Super recomendo para serviços locais.', 'Plataforma fácil e confiável.'].map((quote) => (
            <article className="testimonial-card" key={quote}>
              <b>“</b><p>{quote}</p><span className="stars">★★★★★</span>
            </article>
          ))}
        </section>

        <section className="wire-banner">
          <div className="phone-icon-card"><NuboLogo /></div>
          <div><h2>Pronto para contratar com mais praticidade?</h2><p>Milhares de clientes já confiam no Nubo para resolver o dia a dia.</p></div>
          <Link to="/prestadores" className="wire-cta">Quero fazer parte <Icon name="arrowRight" /></Link>
        </section>

        <footer className="wire-footer">
          <NuboLogo />
          <nav><a>Para clientes</a><a>Para prestadores</a><a>Institucional</a><a>Suporte</a></nav>
          <small>© 2024 Nubo. Todos os direitos reservados.</small>
        </footer>
      </BrowserFrame>

      <section className="mobile-landing-layout">
        <NuboLogo />
        <div className="mobile-hero-copy">
          <h1>Encontre <span>prestadores</span> perto de você</h1>
          <i />
          <p>Agende serviços com praticidade e confiança</p>
          <Link to="/prestadores" className="wire-cta">Conheça o Nubo <Icon name="arrowRight" /></Link>
        </div>
        <ClientPhonePreview />
        <div className="mobile-values-row">
          <div><Icon name="location" /><span>Perto<br />de você</span></div>
          <div><Icon name="shield" /><span>Verificados</span></div>
          <div><Icon name="calendar" /><span>Agendamento<br />fácil</span></div>
        </div>
      </section>
    </main>
  );
}
