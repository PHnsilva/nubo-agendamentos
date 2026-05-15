import type {
  Appointment,
  AuthResponse,
  AvailabilityBlock,
  Category,
  PageResponse,
  ProviderApplication,
  ProviderDetail,
  ProviderSummary,
  Role,
  ServiceOffering,
  User,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
const TOKEN_KEY = 'nubo.accessToken';
const USER_KEY = 'nubo.user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  window.dispatchEvent(new Event('nubo:auth-changed'));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('nubo:auth-cleared'));
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return normalizeStoredUser(JSON.parse(raw));
  } catch {
    clearAuthSession();
    return null;
  }
}

function normalizeStoredUser(value: unknown): User | null {
  if (!value || typeof value !== 'object') return null;
  const user = value as Partial<User> & { roles?: string[] };
  const role = normalizeRole(user.role ?? user.roles);
  if (!user.id || !user.name || !user.email || !role) {
    clearAuthSession();
    return null;
  }
  const normalized = { id: user.id, name: user.name, email: user.email, role };
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  return normalized;
}

function normalizeRole(value: unknown): Role | null {
  if (value === 'MODERADOR' || value === 'PRESTADOR' || value === 'CLIENTE') return value;
  if (value === 'ADMIN') return 'MODERADOR';
  if (value === 'PRESTADOR_CANDIDATO') return 'CLIENTE';
  if (Array.isArray(value)) {
    if (value.includes('ADMIN') || value.includes('MODERADOR')) return 'MODERADOR';
    if (value.includes('PRESTADOR')) return 'PRESTADOR';
    return 'CLIENTE';
  }
  return null;
}

function withQuery(path: string, params?: Record<string, string | number | undefined>) {
  if (!params) return path;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (response.status === 401) clearAuthSession();
    const details = Array.isArray(payload?.details)
      ? payload.details.map((detail: { field?: string; message?: string }) => detail.message ?? detail.field).filter(Boolean)
      : [];
    throw new Error(details[0] ?? payload?.message ?? (response.status === 403 ? 'Acesso negado para o seu perfil.' : 'Não foi possível concluir a operação.'));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const apiClient = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  getCategories: () => request<Category[]>('/categories'),
  getProviders: (params?: Record<string, string | number | undefined>) =>
    request<PageResponse<ProviderSummary>>(withQuery('/providers', params)),
  getProvider: (id: string) => request<ProviderDetail>(`/providers/${id}`),
  submitProviderApplication: (payload: unknown) =>
    request<ProviderApplication>('/provider-applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMyProviderApplication: () => request<ProviderApplication>('/me/provider-application'),
  getMyAppointments: () => request<Appointment[]>('/me/appointments'),
  requestAppointment: (payload: unknown) =>
    request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAdminApplications: (status?: string) =>
    request<PageResponse<ProviderApplication>>(withQuery('/admin/provider-applications', { status })),
  getAdminApplication: (id: string) => request<ProviderApplication>(`/admin/provider-applications/${id}`),
  decideApplication: (id: string, action: 'approve' | 'reject' | 'request-changes', message: string) =>
    request<ProviderApplication>(`/admin/provider-applications/${id}/${action}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  getProviderServices: () => request<ServiceOffering[]>('/provider-dashboard/services'),
  getProviderAvailability: () => request<AvailabilityBlock[]>('/provider-dashboard/availability'),
  confirmAppointment: (id: string) =>
    request<Appointment>(`/appointments/${id}/confirm`, {
      method: 'POST',
    }),
  rejectAppointment: (id: string, reason: string) =>
    request<Appointment>(`/appointments/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  cancelAppointment: (id: string, reason: string) =>
    request<Appointment>(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};
