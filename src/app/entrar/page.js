'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
      
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou senha inválidos'
        : 'Ocorreu um erro ao fazer login'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setError('Erro ao entrar com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showTitle={true} showButton={false}/>

      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Entre na sua conta
              </h3>
              <p className="text-center text-gray-700 text-sm mb-6">
                Preencha os dados abaixo para entrar
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4 text-gray-400" /> : 
                      <Eye className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                </div>

                {/* Link para redefinir senha */}
                <div className="flex justify-end">
                  <Link 
                    href="/recuperar-senha" 
                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-700 text-sm">
                  Ainda não tem uma conta?{' '}
                  <Link 
                    href="/cadastrar" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    Cadastre-se aqui
                  </Link>
                </p>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-700">
                  ou continuar com
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors disabled:bg-gray-100"
            >
               {/* Icon do Google adicionar no svg abaixo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                {/* ... SVG paths ... */}
              </svg>
              <span className="text-gray-800">Google</span>
            </button>

            <p className="mt-8 text-center text-xs text-gray-700">
              Ao fazer login, você concorda com nossos{' '}
              <Link href="/terms" className="text-emerald-600 hover:underline">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}