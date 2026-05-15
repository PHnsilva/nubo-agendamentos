import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../app/providers';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'Informe a senha.'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applyAuth } = useAuth();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  async function submit(data: LoginForm) {
    try {
      const auth = await apiClient.login(data.email, data.password);
      applyAuth(auth);
      navigate((location.state as { from?: string } | null)?.from ?? '/prestadores');
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Falha no login.' });
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-card">
          <span className="icon-pill amber"><Icon name="shield" /></span>
          <h1>Conta única para cliente, prestador e moderação.</h1>
          <p>O acesso libera solicitações de agenda, painel do prestador aprovado e fila administrativa por perfil.</p>
        </div>
      </div>

      <form className="auth-card" onSubmit={handleSubmit(submit)}>
        <span className="eyebrow">Entrar</span>
        <h1>Acesse sua conta Nubo.</h1>
        <label>
          E-mail
          <input {...register('email')} placeholder="cliente@nubo.local" />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
        <label>
          Senha
          <input type="password" {...register('password')} placeholder="Cliente@123" />
          {errors.password && <small>{errors.password.message}</small>}
        </label>
        {errors.root && <p className="notice error">{errors.root.message}</p>}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          Entrar
          <Icon name="arrowRight" />
        </button>
        <p>Não tem conta? <Link className="muted-link" to="/cadastro">Criar cadastro</Link></p>
      </form>
    </section>
  );
}
