import {
  type FormEvent,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from 'lucide-react';

import authService from '../../../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Informe o e-mail.');
      return;
    }

    if (!password) {
      setError('Informe a senha.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authService.login({
        email: normalizedEmail,
        password,
      });

      /*
       * O token já foi salvo pelo authService.
       * Não tente acessar result.data.token aqui.
       */
      navigate('/', {
        replace: true,
      });
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : 'Não foi possível realizar o login.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60">
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <HeartPulse
              className="text-emerald-700"
              size={34}
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Cuidar+
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Acesse sua conta para continuar
          </p>
        </header>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="email"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                disabled={loading}
                id="email"
                name="email"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="seu@email.com"
                type="email"
                value={email}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="password"
            >
              Senha
            </label>

            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                disabled={loading}
                id="password"
                name="password"
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Digite sua senha"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
              />

              <button
                aria-label={
                  showPassword
                    ? 'Ocultar senha'
                    : 'Mostrar senha'
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                type="button"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading && (
              <LoaderCircle
                className="animate-spin"
                size={19}
              />
            )}

            {loading
              ? 'Entrando...'
              : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}