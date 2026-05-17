import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { NuboLogo } from '../../assets/svg/NuboLogo';
import { Icon } from '../ui/Icon';

export function WireframeNav() {
  return (
    <header className="wire-nav">
      <Link to="/" className="wire-nav__brand" aria-label="Nubo">
        <NuboLogo />
      </Link>
      <nav className="wire-nav__links" aria-label="Navegação principal">
        <Link to="/">Como funciona</Link>
        <Link to="/prestadores">Para clientes</Link>
        <Link to="/sou-prestador">Para prestadores</Link>
        <Link to="/prestadores">Categorias <Icon name="chevronDown" /></Link>
      </nav>
      <div className="wire-nav__actions">
        <Link to="/login" className="wire-link">Entrar</Link>
        <Link to="/cadastro" className="wire-cta wire-cta--small">Criar conta</Link>
      </div>
    </header>
  );
}

export function BrowserFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`browser-frame ${className}`.trim()}>
      <div className="browser-frame__bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="browser-frame__content">{children}</div>
    </section>
  );
}
