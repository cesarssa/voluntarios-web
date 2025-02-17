'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/atualizar-senha`,
        emailRedirectTo: `${window.location.origin}/atualizar-senha`
      });

      if (error) throw error;

      setMessage('Email de recuperação enviado. Verifique sua caixa de entrada.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showTitle={true} showButton={false} />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
            Recuperar Senha
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Digite seu e-mail para receber as instruções
          </p>

          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md disabled:bg-emerald-300"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/entrar"
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}