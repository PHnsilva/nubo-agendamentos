import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';
import type { ProviderSummary } from '../types/api';
import { currency, initials } from '../utils/format';

export function ProvidersPage() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    category: searchParams.get('category') ?? '',
    service: '',
    minRating: '',
    maxPrice: '',
    availableDate: '',
  });

  async function loadProviders(nextFilters = filters) {
    try {
      setError('');
      const page = await apiClient.getProviders({ ...nextFilters, size: 12 });
      setProviders(page.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar prestadores.');
    }
  }

  useEffect(() => {
    void loadProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadProviders(filters);
  }

  return (
    <section className="page-shell">
      <div className="section-heading align-left">
        <span className="eyebrow">Busca pública</span>
        <h1>Prestadores aprovados perto de você.</h1>
        <p>Compare perfis em cards com categoria, preço inicial, regiões atendidas e agenda publicada.</p>
      </div>

      <div className="search-layout">
        <form className="filter-panel surface-panel" onSubmit={submit}>
          <span className="icon-pill"><Icon name="sliders" /></span>
          <label>
            Cidade
            <input value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} placeholder="Belo Horizonte" />
          </label>
          <label>
            Categoria
            <input value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} placeholder="Beleza" />
          </label>
          <label>
            Serviço
            <input value={filters.service} onChange={(event) => setFilters({ ...filters, service: event.target.value })} placeholder="Maquiagem" />
          </label>
          <label>
            Data disponível
            <input type="date" value={filters.availableDate} onChange={(event) => setFilters({ ...filters, availableDate: event.target.value })} />
          </label>
          <label>
            Avaliação mínima
            <input type="number" min="0" max="5" step="0.1" value={filters.minRating} onChange={(event) => setFilters({ ...filters, minRating: event.target.value })} placeholder="4.5" />
          </label>
          <label>
            Preço até
            <input type="number" min="0" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} placeholder="150" />
          </label>
          <button className="primary-button" type="submit">
            Filtrar
            <Icon name="search" />
          </button>
        </form>

        <div className="provider-grid">
          {error && <p className="notice error">{error}</p>}
          {!error && providers.length === 0 && (
            <div className="surface-panel empty-state">
              <Icon name="search" />
              <h2>Nenhum prestador encontrado</h2>
              <p>Ajuste os filtros para ampliar a busca.</p>
            </div>
          )}
          {providers.map((provider) => (
            <article className="provider-card" key={provider.id}>
              <div className="provider-card__head">
                {provider.profileImageUrl ? (
                  <img className="avatar-image" src={provider.profileImageUrl} alt="" />
                ) : (
                  <div className="avatar-placeholder" aria-hidden="true">{initials(provider.publicName)}</div>
                )}
                <div>
                  <h2>{provider.publicName}</h2>
                  <p>{provider.description}</p>
                </div>
              </div>
              <div className="provider-meta">
                <span className="metric-line"><Icon name="location" />{provider.city} · {provider.regions.slice(0, 2).join(', ')}</span>
                <span className="metric-line"><Icon name="star" />{provider.ratingAverage.toFixed(1)} de {provider.ratingCount} avaliações</span>
                <span className="metric-line"><Icon name="wallet" />A partir de {currency.format(provider.basePriceFrom)}</span>
              </div>
              <div className="chip-row">
                {provider.categories.map((category) => <span className="chip coral" key={category}>{category}</span>)}
                {provider.servicesPreview.map((service) => <span className="chip" key={service}>{service}</span>)}
              </div>
              <Link className="secondary-button" to={`/prestadores/${provider.id}`}>
                Ver agenda
                <Icon name="calendar" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
