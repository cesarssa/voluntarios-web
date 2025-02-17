'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export default function VoluntarioPage({ params }) {
  const router = useRouter();
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    availability: ''
  });

  useEffect(() => {
    fetchShelterAndCheckVolunteer();
  }, [params.id]);

  const fetchShelterAndCheckVolunteer = async () => {
    try {
      setLoading(true);
      
      // Verificar se usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/entrar');
        return;
      }

      // Carregar dados do abrigo
      const { data: shelterData, error: shelterError } = await supabase
        .from('shelters')
        .select('*')
        .eq('id', params.id)
        .single();

      if (shelterError) throw shelterError;
      setShelter(shelterData);

      // Verificar se já é voluntário
      const { data: volunteerData, error: volunteerError } = await supabase
        .from('volunteers')
        .select('*')
        .eq('shelter_id', params.id)
        .eq('user_id', session.user.id)
        .single();

      if (volunteerData) {
        setSuccess('Você já se cadastrou como voluntário neste abrigo.');
      }

    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao carregar informações do abrigo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/entrar');
        return;
      }

      const { error } = await supabase.from('volunteers').insert({
        user_id: session.user.id,
        shelter_id: params.id,
        message: formData.message,
        availability: formData.availability
      });

      if (error) throw error;

      setSuccess('Cadastro como voluntário realizado com sucesso!');
      setFormData({ message: '', availability: '' });

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setError('Erro ao cadastrar como voluntário');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showTitle={false} showButton={false} />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showTitle={false} showButton={false} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                Voluntariar-se
              </h1>

              {shelter && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-2">
                    {shelter.responsible_name}
                  </h2>
                  <p className="text-gray-600">{shelter.description}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
                  {error}
                </div>
              )}

              {success ? (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded">
                  {success}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem para o abrigo
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="4"
                      required
                      placeholder="Conte-nos por que você quer ser voluntário..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade
                    </label>
                    <input
                      type="text"
                      value={formData.availability}
                      onChange={(e) => setFormData(prev => ({...prev, availability: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                      placeholder="Ex: Segunda a sexta, períodos disponíveis..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md disabled:bg-emerald-300"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Cadastro'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}