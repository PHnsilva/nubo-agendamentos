import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../app/providers';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { ApplicationStatus, ProviderApplication } from '../types/api';
import { applicationStatusLabel, currency } from '../utils/format';

const schema = z.object({
  publicName: z.string().min(3, 'Informe o nome público.'),
  contactPhone: z.string().min(8, 'Informe um telefone.'),
  whatsapp: z.string().min(8, 'Informe o WhatsApp.'),
  city: z.string().min(2, 'Informe a cidade.'),
  regionsText: z.string().min(2, 'Informe ao menos uma região.'),
  categoriesText: z.string().min(2, 'Informe ao menos uma categoria.'),
  description: z.string().min(30, 'Descreva sua atuação em pelo menos 30 caracteres.'),
  servicesDescription: z.string().min(10, 'Informe os serviços prestados.'),
  basePrice: z.string().optional(),
  profileImageUrl: z.string().optional(),
  portfolioText: z.string().optional(),
});

type ApplicationForm = z.infer<typeof schema>;

const tones: Record<ApplicationStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  APROVADO: 'success',
  PENDENTE: 'warning',
  REJEITADO: 'danger',
  AJUSTE_SOLICITADO: 'info',
};

function splitList(value?: string) {
  return value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
}

export function ProviderApplicationPage() {
  const { isAuthenticated, user } = useAuth();
  const [currentApplication, setCurrentApplication] = useState<ProviderApplication | null>(null);
  const [status, setStatus] = useState('');
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ApplicationForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CLIENTE') return;
    apiClient.getMyProviderApplication().then(setCurrentApplication).catch(() => undefined);
  }, [isAuthenticated, user?.role]);

  async function submit(data: ApplicationForm) {
    try {
      const application = await apiClient.submitProviderApplication({
        publicName: data.publicName,
        contactPhone: data.contactPhone,
        whatsapp: data.whatsapp,
        description: data.description,
        city: data.city,
        regions: splitList(data.regionsText),
        categories: splitList(data.categoriesText),
        servicesDescription: data.servicesDescription,
        basePrice: data.basePrice ? Number(data.basePrice) : undefined,
        profileImageUrl: data.profileImageUrl || undefined,
        portfolioImageUrls: splitList(data.portfolioText),
      });
      setCurrentApplication(application);
      setStatus('Cadastro em análise. Avisaremos quando houver uma decisão.');
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Não foi possível enviar a candidatura.' });
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="page-shell narrow">
        <div className="surface-panel status-card">
          <span className="icon-pill coral"><Icon name="userCheck" /></span>
          <span className="eyebrow">Sou prestador</span>
          <h1>Entre para enviar sua candidatura.</h1>
          <p>O cadastro de prestador fica vinculado ao seu usuário para acompanhar o status da análise.</p>
          <Link className="primary-button" to="/login">
            Entrar
            <Icon name="arrowRight" />
          </Link>
        </div>
      </section>
    );
  }

  if (user?.role !== 'CLIENTE') {
    const isModerator = user?.role === 'MODERADOR';
    return (
      <section className="page-shell narrow">
        <div className="surface-panel status-card">
          <span className="icon-pill coral"><Icon name={isModerator ? 'shield' : 'userCheck'} /></span>
          <span className="eyebrow">Sou prestador</span>
          <h1>{isModerator ? 'A candidatura é enviada por contas cliente.' : 'Seu perfil de prestador já está ativo.'}</h1>
          <p>
            {isModerator
              ? 'Use a moderação para analisar candidaturas. Para se candidatar como prestador, entre com uma conta cliente.'
              : 'Use o painel do prestador para acompanhar serviços, disponibilidade e solicitações.'}
          </p>
          <Link className="primary-button" to={isModerator ? '/admin' : '/prestador'}>
            {isModerator ? 'Ir para moderação' : 'Ir para painel'}
            <Icon name="arrowRight" />
          </Link>
        </div>
      </section>
    );
  }

  if (currentApplication) {
    return (
      <section className="page-shell narrow">
        <div className="surface-panel status-card">
          <span className="icon-pill"><Icon name="shield" /></span>
          <span className="eyebrow">Status da candidatura</span>
          <h1>{applicationStatusLabel[currentApplication.status]}</h1>
          <Badge tone={tones[currentApplication.status]}>{applicationStatusLabel[currentApplication.status]}</Badge>
          <p>{currentApplication.reviewMessage ?? 'Sua candidatura está registrada no Nubo.'}</p>
          <dl className="definition-grid">
            <div><dt>Cidade</dt><dd>{currentApplication.city}</dd></div>
            <div><dt>Preço base</dt><dd>{currentApplication.basePrice != null ? currency.format(currentApplication.basePrice) : 'Não informado'}</dd></div>
            <div><dt>Regiões</dt><dd>{currentApplication.regions.join(', ')}</dd></div>
            <div><dt>Categorias</dt><dd>{currentApplication.categories.join(', ')}</dd></div>
          </dl>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell narrow">
      <form className="form-stack" onSubmit={handleSubmit(submit)}>
        <div className="section-heading align-left">
          <span className="eyebrow">Sou prestador</span>
          <h1>Envie sua candidatura para análise.</h1>
          <p>Use informações claras: nome público, região, categoria, serviços, preço inicial e referências.</p>
        </div>
        <div className="surface-panel form-grid">
          <label>
            Nome público
            <input {...register('publicName')} />
            {errors.publicName && <small>{errors.publicName.message}</small>}
          </label>
          <label>
            Telefone
            <input {...register('contactPhone')} />
            {errors.contactPhone && <small>{errors.contactPhone.message}</small>}
          </label>
          <label>
            WhatsApp
            <input {...register('whatsapp')} />
            {errors.whatsapp && <small>{errors.whatsapp.message}</small>}
          </label>
          <label>
            Cidade
            <input {...register('city')} />
            {errors.city && <small>{errors.city.message}</small>}
          </label>
          <label>
            Regiões atendidas
            <input {...register('regionsText')} placeholder="Centro, Savassi" />
            {errors.regionsText && <small>{errors.regionsText.message}</small>}
          </label>
          <label>
            Categorias
            <input {...register('categoriesText')} placeholder="Beleza e estética" />
            {errors.categoriesText && <small>{errors.categoriesText.message}</small>}
          </label>
          <label>
            Preço inicial
            <input type="number" min="0" step="0.01" {...register('basePrice')} placeholder="80" />
          </label>
          <label>
            Foto de perfil URL
            <input {...register('profileImageUrl')} />
          </label>
          <label className="wide">
            Descrição curta
            <textarea rows={4} {...register('description')} />
            {errors.description && <small>{errors.description.message}</small>}
          </label>
          <label className="wide">
            Serviços prestados
            <textarea rows={4} {...register('servicesDescription')} />
            {errors.servicesDescription && <small>{errors.servicesDescription.message}</small>}
          </label>
          <label className="wide">
            Portfólio URLs
            <input {...register('portfolioText')} placeholder="url1, url2" />
          </label>
        </div>
        {errors.root && <p className="notice error">{errors.root.message}</p>}
        {status && <p className="notice">{status}</p>}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          Enviar candidatura
          <Icon name="arrowRight" />
        </button>
      </form>
    </section>
  );
}
