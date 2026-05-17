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
  { name: 'Marcos Silva', role: 'Eletricista', rating: '4,9' },
  { name: 'João Ferreira', role: 'Encanador', rating: '4,8' },
  { name: 'Rafaela Souza', role: 'Pintora', rating: '4,7' },
  { name: 'Carlos Mendes', role: 'Montador de Móveis', rating: '4,8' },
  { name: 'Juliana Lima', role: 'Limpeza', rating: '4,6' },
  { name: 'Paulo Andrade', role: 'Eletricista', rating: '4,7' },
];

function SearchProviderCard({ provider }: { provider: (typeof providers)[number] }) {
  return (
    <article className="search-provider-card">
      <span className="avatar-placeholder"><Icon name="user" /></span>
      <div>
        <h3>{provider.name}</h3>
        <p>{provider.role}</p>
        <span className="stars">★★★★★ <b>{provider.rating}</b></span>
        <span className="verified"><Icon name="shield" /> Verificado</span>
      </div>
      <Icon className="bookmark" name="bookmark" />
      <Link className="wire-button wire-button--ghost" to="/prestadores/1">Ver perfil</Link>
    </article>
  );
}

function FilterPanel({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? 'filter-sheet' : 'filter-panel'}>
      <div className="filter-panel__head"><h2>Filtros</h2>{!compact && <button type="button">Limpar</button>}<button className="filter-close" type="button"><Icon name="x" /></button></div>
      <label className="filter-row"><Icon name="briefcase" /><span>Tipo de serviço</span><b>{compact ? '' : 'Todos os serviços'}</b><Icon name="chevronDown" /></label>
      <label className="filter-row"><Icon name="location" /><span>Distância</span><b>Até 10 km</b><Icon name="chevronDown" /></label>
      <label className="filter-row"><Icon name="star" /><span>Avaliação mínima</span><b>4,0+</b><Icon name="chevronDown" /></label>
      <button className="wire-cta filter-apply" type="button">Aplicar filtros</button>
    </aside>
  );
}

function SearchPhonePreview() {
  return (
    <div className="phone-shell search-phone">
      <div className="phone-status"><span>9:41</span><i /><span>▴ ◔ ▰</span></div>
      <div className="phone-screen-content">
        <div className="phone-top-row">
          <button className="location-chip" type="button"><Icon name="location" /> São Paulo, SP <Icon name="chevronDown" /></button>
          <button className="icon-square" type="button"><Icon name="sliders" /></button>
        </div>
        <div className="phone-search"><Icon name="search" /><span>Buscar serviço ou profissional...</span></div>
        <div className="phone-category-row">
          {categories.slice(0, 3).map((item) => <div className="phone-category" key={item.label}><Icon name={item.icon} /><span>{item.label}</span></div>)}
        </div>
        {providers.slice(0, 2).map((provider) => (
          <article className="phone-result-card" key={provider.name}>
            <span className="avatar-placeholder"><Icon name="user" /></span>
            <div><h3>{provider.name}</h3><p>{provider.role}</p><span className="stars">★★★★★ <b>{provider.rating}</b></span><span className="verified"><Icon name="shield" /> Verificado</span></div>
            <Icon className="bookmark" name="bookmark" />
          </article>
        ))}
      </div>
      <FilterPanel compact />
    </div>
  );
}

export function ProvidersPage() {
  return (
    <main className="wire-page providers-page">
      <div className="desktop-wire-heading desktop-only-title"><strong>Wireframe 02 — <span>Busca + Filtros Desktop</span></strong></div>
      <div className="mobile-wire-label">Wireframe 02 — Busca + Filtros</div>

      <BrowserFrame className="providers-desktop-frame">
        <WireframeNav />
        <section className="desktop-search-bar search-page-bar">
          <button type="button"><Icon name="location" /> São Paulo, SP <Icon name="chevronDown" /></button>
          <label><Icon name="search" /><span>Buscar serviço ou profissional...</span></label>
          <button className="filter-button" type="button"><Icon name="sliders" /> Filtros</button>
        </section>

        <div className="search-desktop-grid">
          <FilterPanel />
          <section className="search-results-area">
            <div className="section-line-title"><h2>Categorias</h2><Link to="/prestadores">Ver todas <Icon name="arrowRight" /></Link></div>
            <div className="category-grid search-categories">
              {categories.map((item) => <Link to="/prestadores" className="category-card" key={item.label}><Icon name={item.icon} /><span>{item.label}</span></Link>)}
            </div>
            <div className="section-line-title"><h2>6 prestadores encontrados</h2><button type="button">Mais bem avaliados <Icon name="chevronDown" /></button></div>
            <div className="search-provider-grid">
              {providers.map((provider) => <SearchProviderCard provider={provider} key={provider.name} />)}
            </div>
          </section>
        </div>

        <section className="wire-banner compact-banner">
          <div className="phone-icon-card"><NuboLogo /></div>
          <div><h2>Não encontrou o que precisa?</h2><p>Conte para a gente. Vamos ajudar a encontrar o profissional ideal.</p></div>
          <Link className="wire-cta" to="/prestadores">Quero pedir ajuda <Icon name="arrowRight" /></Link>
        </section>
      </BrowserFrame>

      <section className="mobile-showcase search-mobile-showcase">
        <NuboLogo />
        <div className="mobile-side-copy"><h1>Busca <span>simples</span> para encontrar o profissional ideal</h1><i /></div>
        <SearchPhonePreview />
      </section>
    </main>
  );
}
