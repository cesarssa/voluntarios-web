'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function AbrigoRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  const [shelterData, setAbrigoData] = useState({
    responsible_name: '',
    phone: '',
    email: '',
    available_hours: '',
    available_days: '',
    status: 'Ativo',
    address: '',
    neighborhood: '',
    city: '',
    zip_code: '',
    number: '',
    complement: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          router.push('/entrar');
          return;
        }
        setUser(session.user);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/entrar');
      }
    };
    getUser();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAbrigoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `shelter-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('shelter-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('shelter-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      setError('Erro ao fazer upload das imagens');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const shelterInsertData = {
        user_id: user.id,
        responsible_name: shelterData.responsible_name,
        phone: shelterData.phone,
        email: shelterData.email,
        available_hours: shelterData.available_hours,
        available_days: shelterData.available_days,
        status: shelterData.status,
        address: shelterData.address,
        neighborhood: shelterData.neighborhood,
        city: shelterData.city,
        zip_code: shelterData.zip_code,
        number: shelterData.number,
        complement: shelterData.complement,
        description: shelterData.description,
        gallery_images: images
      };

      const { data, error } = await supabase
        .from('shelters')
        .insert([shelterInsertData])
        .select()
        .single();

      if (error) throw error;

      alert('Abrigo cadastrado com sucesso!');
      router.push('/dashboard');

    } catch (error) {
      console.error('Erro ao salvar abrigo:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showTitle={false} showButton={false} />

      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-8 bg-gray-50">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
                {error}
              </div>
            )}

            {/* Informações Básicas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contato Responsável
                  </label>
                  <input
                    type="text"
                    name="responsible_name"
                    value={shelterData.responsible_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shelterData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horários
                  </label>
                  <input
                    type="text"
                    name="available_hours"
                    value={shelterData.available_hours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dias
                  </label>
                  <input
                    type="text"
                    name="available_days"
                    value={shelterData.available_days}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={shelterData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Endereço */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shelterData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={shelterData.neighborhood}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shelterData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CEP
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={shelterData.zip_code}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={shelterData.number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complement"
                      value={shelterData.complement}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Galeria e Descrição */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Galeria de fotos
                    </label>
                    <div className="border border-gray-300 rounded-md p-2">
                      <div className="flex gap-2">
                        {images.map((img, index) => (
                          <div key={index} className="relative w-24 h-24">
                            <Image
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                      <label className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded cursor-pointer mt-2">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          multiple
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      value={shelterData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-800"
                onClick={() => window.history.back()}
                disabled={saving}
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
        </main>
      </div>
      <Footer />
    </div>
  );
}