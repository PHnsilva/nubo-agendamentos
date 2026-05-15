import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './protected-route';
import { AdminApplicationDetailPage } from '../pages/AdminApplicationDetailPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { MyAppointmentsPage } from '../pages/MyAppointmentsPage';
import { ProviderApplicationPage } from '../pages/ProviderApplicationPage';
import { ProviderDashboardPage } from '../pages/ProviderDashboardPage';
import { ProviderProfilePage } from '../pages/ProviderProfilePage';
import { ProvidersPage } from '../pages/ProvidersPage';
import { RegisterPage } from '../pages/RegisterPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/prestadores', element: <ProvidersPage /> },
      { path: '/prestadores/:id', element: <ProviderProfilePage /> },
      { path: '/sou-prestador', element: <ProviderApplicationPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/cadastro', element: <RegisterPage /> },
      {
        element: <ProtectedRoute roles={['CLIENTE', 'PRESTADOR']} />,
        children: [{ path: '/meus-agendamentos', element: <MyAppointmentsPage /> }],
      },
      {
        element: <ProtectedRoute roles={['PRESTADOR']} />,
        children: [{ path: '/prestador', element: <ProviderDashboardPage /> }],
      },
      {
        element: <ProtectedRoute roles={['MODERADOR']} />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/candidaturas/:id', element: <AdminApplicationDetailPage /> },
        ],
      },
    ],
  },
]);
