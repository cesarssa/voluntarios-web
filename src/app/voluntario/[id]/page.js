'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

export default function VoluntarioPage({ params }) {
  const router = useRouter();
  const [abrigo, setAbrigo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    disponibilidade: '',
    mensagem: ''
  });

  useEffect(() => {
    buscarAbrigo();
  }, [params.id]);

  const buscarAbrigo = async () => {
    try {
      const { data, error } = await supabase
        .from('abrigos')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setAbrigo(data);
    } catch (error) {
      console.error('Erro ao carregar abrigo:', error);
      setError('Não foi possível carregar as informações do abrigo');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Você precisa estar logado para se voluntariar');
        return;
      }

      // Verificar se já existe uma solicitação pendente
      const { data: existingRequest } = await supabase
        .from('voluntariar')
        .select('*')
        .eq('id_usuario', user.id)
        .eq('id_abrigo', params.id)
        .single();

      if (existingRequest) {
        setError('Você já possui uma solicitação para este abrigo');
        return;
      }

      const { error: insertError } = await supabase
        .from('voluntariar')
        .insert([
          {
            id_usuario: user.id,
            id_abrigo: params.id,
            disponibilidade: formData.disponibilidade,
            mensagem: formData.mensagem,
            situacao: 'Pendente'
          }
        ]);

      if (insertError) throw insertError;

      alert('Solicitação de voluntariado enviada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setError('Erro ao enviar solicitação. Por favor, tente novamente.');
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
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Voluntariar-se para {abrigo?.nome_abrigo}
              </h1>

              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Informações do Abrigo</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Responsável:</span> {abrigo?.nome_responsavel}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Horário:</span> {abrigo?.horario_funcionamento}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dias:</span> {abrigo?.dias_funcionamento}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidade
                  </label>
                  <input
                    type="text"
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                    placeholder="Ex: Segunda a Sexta, período da tarde"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem para o Abrigo
                  </label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                    placeholder="Conte-nos por que você quer ser voluntário e qual sua experiência com animais"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}