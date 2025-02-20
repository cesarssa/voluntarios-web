'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { ArrowRightCircle, Users, FileText, Calendar, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [voluntarios, setVoluntarios] = useState([]);
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
          .from('perfis')
          .select('nome')
          .eq('id_usuario', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setProfile(profileData);

        // Carregar solicitações de voluntariado
        const { data: voluntariarData, error: voluntariarError } = await supabase
          .from('voluntariar')
          .select(`
            *,
            abrigos (
              nome_abrigo,
              cidade
            )
          `)
          .eq('id_usuario', session.user.id)
          .order('criado_em', { ascending: false });

        if (voluntariarError) throw voluntariarError;

        setVoluntarios(voluntariarData);
        
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

  const getSituacaoStyle = (situacao) => {
    const styles = {
      'Pendente': 'bg-yellow-50 text-yellow-700',
      'Aprovado': 'bg-green-50 text-green-700',
      'Rejeitado': 'bg-red-50 text-red-700'
    };
    return styles[situacao] || 'bg-gray-50 text-gray-700';
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                Bem-vindo(a) {profile?.nome || ''}
              </h1>
              <p className="text-gray-600">
                Este é seu painel de controle. Aqui você pode gerenciar todas as suas atividades.
              </p>
            </div>

            {/* Seção de Voluntariados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Meus Voluntariados</h2>
              
              {voluntarios.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Você ainda não se voluntariou em nenhum abrigo.</p>
                  <button 
                    onClick={() => router.push('/listar-abrigos')}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Encontrar Abrigos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {voluntarios.map((voluntario) => (
                    <div 
                      key={voluntario.id} 
                      className="p-4 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {voluntario.abrigos.nome_abrigo}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {voluntario.abrigos.cidade}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getSituacaoStyle(voluntario.situacao)}`}>
                          {voluntario.situacao}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Disponibilidade:</span> {voluntario.disponibilidade}
                        </p>
                        {voluntario.mensagem && (
                          <p className="text-gray-600 mt-1">
                            <span className="font-medium">Mensagem:</span> {voluntario.mensagem}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-2">
                          Solicitado em: {formatarData(voluntario.criado_em)}
                        </p>
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