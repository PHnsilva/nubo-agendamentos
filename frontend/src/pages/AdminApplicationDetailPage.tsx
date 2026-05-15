import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { ApplicationStatus, ProviderApplication } from '../types/api';
import { applicationStatusLabel, currency } from '../utils/format';

const tones: Record<ApplicationStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  APROVADO: 'success',
  PENDENTE: 'warning',
  REJEITADO: 'danger',
  AJUSTE_SOLICITADO: 'info',
};

export function AdminApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setError('');
    apiClient.getAdminApplication(id)
      .then(setApplication)
      .catch((err) => setError(err instanceof Error ? err.message : 'Candidatura não encontrada.'));
  }, [id]);

  async function decide(action: 'approve' | 'reject' | 'request-changes', event: FormEvent) {
    event.preventDefault();
    if (!id) return;
    if (action !== 'approve' && !message.trim()) {
      setError('Justificativa é obrigatória para rejeitar ou solicitar ajuste.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await apiClient.decideApplication(id, action, message);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível registrar decisão.');
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !application) return <section className="page-shell"><p className="notice error">{error}</p></section>;
  if (!application) return <section className="page-shell"><p className="notice">Carregando candidatura...</p></section>;

  return (
    <section className="page-shell">
      <div className="detail-layout">
        <article className="surface-panel">
          <span className="eyebrow">Detalhe da candidatura</span>
          <h1>{application.publicName}</h1>
          <div className="chip-row">
            <Badge tone={tones[application.status]}>{applicationStatusLabel[application.status]}</Badge>
            {application.reviewMessage && <span className="chip">{application.reviewMessage}</span>}
          </div>
          <p>{application.description}</p>

          <dl className="definition-grid">
            <div><dt>Contato</dt><dd>{application.contactPhone}</dd></div>
            <div><dt>WhatsApp</dt><dd>{application.whatsapp}</dd></div>
            <div><dt>Cidade</dt><dd>{application.city}</dd></div>
            <div><dt>Preço base</dt><dd>{application.basePrice != null ? currency.format(application.basePrice) : 'Não informado'}</dd></div>
            <div><dt>Regiões</dt><dd>{application.regions.join(', ')}</dd></div>
            <div><dt>Categorias</dt><dd>{application.categories.join(', ')}</dd></div>
            <div className="wide"><dt>Serviços</dt><dd>{application.servicesDescription}</dd></div>
          </dl>

          <div className="portfolio-grid">
            {(application.portfolioImageUrls.length ? application.portfolioImageUrls : ['placeholder']).slice(0, 3).map((image, index) => (
              <div className="portfolio-tile" key={`${image}-${index}`}>
                {image === 'placeholder' ? <Icon name="spark" /> : <img src={image} alt="" />}
              </div>
            ))}
          </div>
        </article>

        <form className="surface-panel decision-panel">
          <span className="icon-pill coral"><Icon name="shield" /></span>
          <h2>Decisão administrativa</h2>
          <p>Rejeição e solicitação de ajuste precisam de justificativa. Aprovação pode usar a mensagem padrão.</p>
          <label>
            Justificativa
            <textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Explique a decisão para registro e acompanhamento" />
          </label>
          {error && <p className="notice error">{error}</p>}
          <button className="primary-button" disabled={submitting} type="submit" onClick={(event) => decide('approve', event)}>
            <Icon name="check" />
            Aprovar
          </button>
          <button className="secondary-button" disabled={submitting} type="submit" onClick={(event) => decide('request-changes', event)}>
            <Icon name="message" />
            Solicitar ajuste
          </button>
          <button className="danger-button" disabled={submitting} type="submit" onClick={(event) => decide('reject', event)}>
            <Icon name="x" />
            Rejeitar
          </button>
        </form>
      </div>
    </section>
  );
}
