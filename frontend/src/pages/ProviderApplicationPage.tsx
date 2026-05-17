import { Link } from 'react-router-dom';
import { NuboLogo } from '../assets/svg/NuboLogo';
import { BrowserFrame, WireframeNav } from '../components/layout/WireframeNav';
import { Icon } from '../components/ui/Icon';

const benefits = [
  { title: 'Perfil profissional', text: 'Mostre seus serviços e conquiste novos clientes.', icon: 'user' as const },
  { title: 'Mais visibilidade', text: 'Seja encontrado por quem precisa do que você faz.', icon: 'eye' as const },
  { title: 'Agendamentos fáceis', text: 'Receba solicitações e organize sua agenda.', icon: 'calendar' as const },
];

function ProviderFormCard({ phone = false }: { phone?: boolean }) {
  return (
    <section className={phone ? 'provider-form-card provider-form-card--phone' : 'provider-form-card'}>
      <div className="form-steps" aria-label="Etapas do cadastro">
        {['Dados', 'Serviços', 'Conclusão'].map((step, index) => (
          <span className={index === 0 ? 'active' : ''} key={step}><b>{index + 1}</b>{step}</span>
        ))}
      </div>
      <label>Nome completo<input placeholder="Seu nome" /></label>
      <label>Categoria de serviço<input placeholder="Selecione sua categoria" /></label>
      <label>Cidade / Região<input placeholder="Ex: São Paulo, SP" /></label>
      <label>Contato (WhatsApp)<input placeholder="(11) 99999-9999" /></label>
      <button className="wire-button wire-button--muted" type="button">Continuar <Icon name="arrowRight" /></button>
    </section>
  );
}

function ProviderPhonePreview() {
  return (
    <div className="phone-shell provider-phone">
      <div className="phone-status"><span>9:41</span><i /><span>▴ ◔ ▰</span></div>
      <div className="phone-screen-content">
        <ProviderFormCard phone />
      </div>
    </div>
  );
}

export function ProviderApplicationPage() {
  return (
    <main className="wire-page provider-application-page">
      <div className="desktop-wire-heading desktop-only-title"><strong>Wireframe 03 — <span>Sou Prestador Desktop</span></strong></div>
      <div className="mobile-wire-label">Wireframe 03 — Sou Prestador</div>

      <BrowserFrame className="provider-application-desktop-frame">
        <WireframeNav />
        <section className="provider-application-desktop">
          <div className="provider-application-copy">
            <h1>É prestador de serviços<span>?</span></h1>
            <p>Cadastre-se no Nubo e receba novos clientes todos os dias.</p>
            <div className="benefit-list">
              {benefits.map((benefit) => (
                <article key={benefit.title}>
                  <Icon name={benefit.icon} />
                  <div><h3>{benefit.title}</h3><p>{benefit.text}</p></div>
                </article>
              ))}
            </div>
          </div>
          <ProviderFormCard />
        </section>
        <section className="wire-banner compact-banner provider-cta-banner">
          <div className="phone-icon-card"><NuboLogo /></div>
          <div><h2>Pronto para conquistar mais clientes?</h2><p>Cadastre-se em poucos passos e comece hoje mesmo.</p></div>
          <Link to="/sou-prestador" className="wire-cta">Quero me cadastrar <Icon name="arrowRight" /></Link>
        </section>
      </BrowserFrame>

      <section className="mobile-provider-layout">
        <NuboLogo />
        <div className="mobile-provider-title"><h1>É prestador de serviços<span>?</span></h1><p>Cadastre-se e receba novos clientes</p></div>
        <ProviderPhonePreview />
        <div className="mobile-values-row provider-values">
          {benefits.map((benefit) => <div key={benefit.title}><Icon name={benefit.icon} /><span>{benefit.title}</span></div>)}
        </div>
        <Link className="wire-cta mobile-wide-cta" to="/sou-prestador">Quero me cadastrar <Icon name="arrowRight" /></Link>
      </section>
    </main>
  );
}
