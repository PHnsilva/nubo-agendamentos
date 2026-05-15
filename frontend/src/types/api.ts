export type Role = 'CLIENTE' | 'PRESTADOR' | 'MODERADOR';

export type ApplicationStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'AJUSTE_SOLICITADO';

export type AppointmentStatus = 'SOLICITADO' | 'CONFIRMADO' | 'RECUSADO' | 'CANCELADO' | 'CONCLUIDO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresInMinutes: number;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ProviderSummary {
  id: string;
  publicName: string;
  slug: string;
  description: string;
  city: string;
  regions: string[];
  categories: string[];
  ratingAverage: number;
  ratingCount: number;
  profileImageUrl?: string;
  servicesPreview: string[];
  basePriceFrom: number;
}

export interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDurationMinutes: number;
}

export interface AvailabilityBlock {
  id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface ProviderDetail extends ProviderSummary {
  contactPhone: string;
  whatsapp: string;
  portfolioImageUrls: string[];
  services: ServiceOffering[];
  availability: AvailabilityBlock[];
}

export interface ProviderApplication {
  id: string;
  publicName: string;
  contactPhone: string;
  whatsapp: string;
  description: string;
  city: string;
  regions: string[];
  categories: string[];
  servicesDescription: string;
  basePrice?: number | null;
  profileImageUrl?: string;
  portfolioImageUrls: string[];
  status: ApplicationStatus;
  reviewMessage?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  providerPublicName: string;
  clientName: string;
  serviceName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  clientNote?: string;
}
