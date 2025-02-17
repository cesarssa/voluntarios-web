'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { ArrowRightCircle, Users, FileText, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw sessionError || new Error('Não autorizado');
        }

        setUser(session.user);

        // Carregar dados do perfil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles1')
          .select('name')
          .eq('user_id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setProfile(profileData);

        // Carregar voluntariados do usuário
        const { data: volunteerData, error: volunteerError } = await supabase
          .from('volunteers')
          .select(`
            *,
            shelter:shelters (
              id,
              responsible_name,
              description
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (volunteerError) throw volunteerError;
        setVolunteers(volunteerData);
        
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setError(error.message);
        router.push('/entrar');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const getStatusColor = (status) => {
    const colors = {
      'Pendente': 'bg-yellow-50 text-yellow-600',
      'Aprovado': 'bg-green-50 text-green-600',
      'Rejeitado': 'bg-red-50 text-red-600'
    };
    return colors[status] || 'bg-gray-50 text-gray-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showTitle={false} showButton={false} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-grow container mx-auto px-4 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* Seção de Boas-vindas */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Bem-vindo(a) {profile?.name || ''}
              </h1>
              <p className="text-gray-600">
                Este é seu painel de controle. Aqui você pode gerenciar todas as suas atividades.
              </p>
            </div>

            {/* Seção de Voluntariados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Meus Voluntariados</h2>
              
              {volunteers.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Você ainda não se voluntariou em nenhum abrigo.</p>
                  <Link 
                    href="/lista-abrigos"
                    className="mt-4 inline-block text-emerald-600 hover:text-emerald-700"
                  >
                    Ver lista de abrigos
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {volunteer.shelter?.responsible_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {volunteer.shelter?.description?.substring(0, 100)}
                            {volunteer.shelter?.description?.length > 100 ? '...' : ''}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(volunteer.status)}`}>
                          {volunteer.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Cadastrado em: {formatDate(volunteer.created_at)}
                        </span>
                        <Link
                          href={`/voluntario/${volunteer.shelter_id}`}
                          className="text-emerald-600 hover:text-emerald-700 text-sm"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}