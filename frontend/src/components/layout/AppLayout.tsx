import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../app/providers';
import { NuboLogo } from '../../assets/svg/NuboLogo';
import { Icon, type IconName } from '../ui/Icon';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  visible: boolean;
}

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const items: NavItem[] = [
    { to: '/prestadores', label: 'Explorar', icon: 'search', visible: true },
    { to: '/sou-prestador', label: 'Candidatura', icon: 'briefcase', visible: !isAuthenticated || user?.role === 'CLIENTE' },
    { to: '/meus-agendamentos', label: 'Agenda', icon: 'calendar', visible: isAuthenticated && user?.role !== 'MODERADOR' },
    { to: '/prestador', label: 'Painel', icon: 'userCheck', visible: user?.role === 'PRESTADOR' },
    { to: '/admin', label: 'Moderação', icon: 'shield', visible: user?.role === 'MODERADOR' },
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand-link" aria-label="Nubo">
          <NuboLogo />
        </Link>
        <nav className="main-nav" aria-label="Navegação principal">
          {items.filter((item) => item.visible).map((item) => (
            <NavLink className="nav-pill" to={item.to} key={item.to}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="role-chip">{user?.role}</span>
              <button className="ghost-button compact" type="button" onClick={logout}>
                <Icon name="x" />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button compact" to="/login">
                <Icon name="userCheck" />
                Entrar
              </Link>
              <Link className="primary-button compact" to="/cadastro">
                Cadastrar
                <Icon name="arrowRight" />
              </Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
