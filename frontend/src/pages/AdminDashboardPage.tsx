import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { ApplicationStatus, ProviderApplication } from '../types/api';
import { applicationStatusLabel } from '../utils/format';

const tones: Record<ApplicationStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  APROVADO: 'success',
  PENDENTE: 'warning',
  REJEITADO: 'danger',
  AJUSTE_SOLICITADO: 'info',
};

export function AdminDashboardPage() {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    apiClient.getAdminApplications(status)
      .then((page) => setApplications(page.content))
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar candidaturas.'));
  }, [status]);

  const summary = useMemo(() => ({
    pending: applications.filter((application) => application.status === 'PENDENTE').length,
    approved: applications.filter((application) => application.status === 'APROVADO').length,
    changes: applications.filter((application) => application.status === 'AJUSTE_SOLICITADO').length,
    rejected: applications.filter((application) => application.status === 'REJEITADO').length,
  }), [applications]);

  return (
    <section className="page-shell">
      <div className="section-heading align-left">
        <span className="eyebrow">Moderação</span>
        <h1>Fila de candidaturas.</h1>
        <p>Cards de análise com status, região, categoria e acesso rápido ao detalhe do prestador.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><strong>{summary.pending}</strong><span>Pendentes</span></div>
        <div className="stat-card"><strong>{summary.changes}</strong><span>Ajustes</span></div>
        <div className="stat-card"><strong>{summary.approved}</strong><span>Aprovados</span></div>
        <div className="stat-card"><strong>{summary.rejected}</strong><span>Rejeitados</span></div>
      </div>

      <div className="toolbar surface-panel">
        <span className="icon-pill"><Icon name="sliders" /></span>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="AJUSTE_SOLICITADO">Ajuste solicitado</option>
          <option value="APROVADO">Aprovado</option>
          <option value="REJEITADO">Rejeitado</option>
        </select>
      </div>

      {error && <p className="notice error">{error}</p>}
      <div className="table-list">
        {applications.map((application) => (
          <article className="queue-card" key={application.id}>
            <div className="queue-card__head">
              <span className="icon-pill coral"><Icon name="userCheck" /></span>
              <div>
                <h2>{application.publicName}</h2>
                <p>{application.city} · {application.categories.join(', ')} · {application.regions.join(', ')}</p>
                <div className="chip-row">
                  <span className="chip">{application.servicesDescription.slice(0, 70)}{application.servicesDescription.length > 70 ? '...' : ''}</span>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Badge tone={tones[application.status]}>{applicationStatusLabel[application.status]}</Badge>
              <Link className="secondary-button compact" to={`/admin/candidaturas/${application.id}`}>
                Analisar
                <Icon name="arrowRight" />
              </Link>
            </div>
          </article>
        ))}
        {!error && applications.length === 0 && (
          <div className="surface-panel empty-state">
            <Icon name="check" />
            <h2>Nenhuma candidatura nesse filtro</h2>
            <p>Altere o status para visualizar outros registros.</p>
          </div>
        )}
      </div>
    </section>
  );
}
