import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../app/providers';
import { Icon } from '../components/ui/Icon';
import { apiClient } from '../services/apiClient';

const schema = z.object({
  name: z.string().min(3, 'Informe seu nome.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres.'),
});

type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { applyAuth } = useAuth();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  async function submit(data: RegisterForm) {
    try {
      const auth = await apiClient.register(data.name, data.email, data.password);
      applyAuth(auth);
      navigate('/prestadores');
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Falha no cadastro.' });
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-card">
          <span className="icon-pill coral"><Icon name="userCheck" /></span>
          <h1>Comece como cliente e evolua para prestador quando for aprovado.</h1>
          <p>Todo cadastro pode solicitar horários. Prestadores passam pela candidatura antes de aparecer na busca pública.</p>
        </div>
      </div>

      <form className="auth-card" onSubmit={handleSubmit(submit)}>
        <span className="eyebrow">Cadastro</span>
        <h1>Crie sua conta cliente.</h1>
        <label>
          Nome
          <input {...register('name')} />
          {errors.name && <small>{errors.name.message}</small>}
        </label>
        <label>
          E-mail
          <input {...register('email')} />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
        <label>
          Senha
          <input type="password" {...register('password')} />
          {errors.password && <small>{errors.password.message}</small>}
        </label>
        {errors.root && <p className="notice error">{errors.root.message}</p>}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          Cadastrar
          <Icon name="arrowRight" />
        </button>
        <p>Já tem conta? <Link className="muted-link" to="/login">Entrar</Link></p>
      </form>
    </section>
  );
}
