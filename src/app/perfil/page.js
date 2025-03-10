'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: '',
    cep: '',
    numero: '',
    complemento: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw sessionError || new Error('Não autorizado');
        }

        setUser(session.user);
        
        const { data: profile, error: profileError } = await supabase
          .from('perfis')
          .select('*')
          .eq('id_usuario', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profile) {
          setProfileData({
            nome: profile.nome || '',
            telefone: profile.telefone || '',
            email: session.user.email || '',
            endereco: profile.endereco || '',
            bairro: profile.bairro || '',
            cidade: profile.cidade || '',
            cep: profile.cep || '',
            numero: profile.numero || '',
            complemento: profile.complemento || '',
          });
          
          if (profile.url_avatar) {
            setProfileImage(profile.url_avatar);
          }
        } else {
          setProfileData(prev => ({
            ...prev,
            email: session.user.email || ''
          }));
        }

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        setProfileImage(publicUrl);

        const { error: updateError } = await supabase
          .from('perfis')
          .upsert({
            id_usuario: user.id,
            url_avatar: publicUrl,
          });

        if (updateError) throw updateError;

      } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        setError('Erro ao atualizar imagem de perfil');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('perfis')
        .upsert({
          id_usuario: user.id,
          nome: profileData.nome,
          telefone: profileData.telefone,
          endereco: profileData.endereco,
          bairro: profileData.bairro,
          cidade: profileData.cidade,
          cep: profileData.cep,
          numero: profileData.numero,
          complemento: profileData.complemento,
        });

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setError('Erro ao salvar alterações do perfil');
    } finally {
      setSaving(false);
    }
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

        <main className="flex-grow p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}

              {/* Seção da foto de perfil */}
              <div className="mb-8 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Foto de perfil"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-5xl">?</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer text-emerald-600 hover:text-emerald-700">
                  <span>Trocar foto de perfil</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Dados pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={profileData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={profileData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={profileData.endereco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={profileData.bairro}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={profileData.cidade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={profileData.cep}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={profileData.numero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={profileData.complemento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-800"
                  onClick={() => window.history.back()}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300"
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}