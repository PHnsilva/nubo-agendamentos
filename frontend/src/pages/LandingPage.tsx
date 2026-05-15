import { Link } from 'react-router-dom';
import { useAuth } from '../app/providers';
import { Icon, type IconName } from '../components/ui/Icon';
import { LandingIllustration } from '../features/landing/LandingIllustration';

const categories: Array<{ name: string; icon: IconName; copy: string }> = [
  { name: 'Beleza e estética', icon: 'spark', copy: 'profissionais de imagem, pele e eventos' },
  { name: 'Casa e manutenção', icon: 'tools', copy: 'reparos, instalações e pequenas obras' },
  { name: 'Aulas e consultorias', icon: 'briefcase', copy: 'especialistas para aprender e decidir' },
  { name: 'Saúde e bem-estar', icon: 'heart', copy: 'rotinas de cuidado com agenda clara' },
  { name: 'Tecnologia', icon: 'calendar', copy: 'suporte, aulas e serviços digitais' },
  { name: 'Eventos', icon: 'star', copy: 'times locais para datas importantes' },
];

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const providerCta = !isAuthenticated || user?.role === 'CLIENTE'
    ? { to: '/sou-prestador', label: 'Sou prestador' }
    : user?.role === 'PRESTADOR'
      ? { to: '/prestador', label: 'Ir ao painel' }
      : { to: '/admin', label: 'Ir à moderação' };

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Curadoria local com agenda no centro</span>
          <h1>Contrate prestadores aprovados sem perder tempo no improviso.</h1>
          <p>
            O Nubo reúne perfis verificados, serviços, regiões atendidas e horários disponíveis para transformar busca local em solicitação de agenda.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/prestadores">
              Encontrar prestador
              <Icon name="search" />
            </Link>
            <Link className="secondary-button" to={providerCta.to}>
              {providerCta.label}
              <Icon name="arrowRight" />
            </Link>
          </div>
          <div className="hero-proof">
            <div className="proof-card">
              <strong>100%</strong>
              <span>perfis passam por análise</span>
            </div>
            <div className="proof-card">
              <strong>1 tela</strong>
              <span>serviço, região e agenda</span>
            </div>
            <div className="proof-card">
              <strong>24h</strong>
              <span>fila pronta para moderar</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <LandingIllustration />
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="eyebrow">Como funciona</span>
          <h2>Um fluxo simples para cliente, prestador e moderação.</h2>
        </div>
        <div className="step-grid">
          {[
            ['1', 'Busque por região', 'Filtre cidade, categoria, preço, avaliação e disponibilidade publicada.'],
            ['2', 'Compare cards completos', 'Veja descrição, serviços, preço inicial, regiões e sinais de confiança.'],
            ['3', 'Solicite um horário', 'O cliente envia a solicitação e o prestador confirma, recusa ou acompanha pelo painel.'],
          ].map(([number, title, text]) => (
            <article className="info-card" key={title}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band alt">
        <div className="section-heading">
          <span className="eyebrow">Categorias</span>
          <h2>Cards de serviço para encontrar o perfil certo.</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" to={`/prestadores?category=${encodeURIComponent(category.name)}`} key={category.name}>
              <span className="category-icon">
                <Icon name={category.icon} />
              </span>
              <span>
                {category.name}
                <small>{category.copy}</small>
              </span>
              <Icon name="arrowRight" />
            </Link>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="eyebrow">Confiança operacional</span>
          <h2>Curadoria, autorização por perfil e agenda visível.</h2>
        </div>
        <div className="feature-grid">
          {[
            ['shield', 'Fila de aprovação', 'Moderador analisa candidatura, justifica decisões e publica apenas aprovados.'],
            ['userCheck', 'Perfis ativos', 'Prestador pendente não aparece na busca nem acessa o painel de prestador.'],
            ['calendar', 'Agenda simplificada', 'Blocos semanais deixam claro quando o cliente pode solicitar atendimento.'],
          ].map(([icon, title, text]) => (
            <article className="feature-card" key={title}>
              <span className="icon-pill coral"><Icon name={icon as IconName} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="provider-callout">
        <div>
          <span className="eyebrow">Para prestadores</span>
          <h2>Monte um perfil público com serviços, regiões, fotos e disponibilidade.</h2>
          <p>Envie a candidatura, acompanhe a análise e use o painel para organizar a rotina quando o cadastro for aprovado.</p>
        </div>
        <Link className="primary-button" to={providerCta.to}>
          {providerCta.label === 'Sou prestador' ? 'Enviar candidatura' : providerCta.label}
          <Icon name="arrowRight" />
        </Link>
      </section>

      <footer className="site-footer">
        <strong>Nubo</strong>
        <span>Prestadores aprovados, agenda clara e contratação local.</span>
      </footer>
    </>
  );
}
