'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function AbrigosListPage() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('status', 'Ativo');

      if (error) throw error;

      setShelters(data);
    } catch (error) {
      console.error('Erro ao carregar abrigos:', error);
      setError('Não foi possível carregar os abrigos');
    } finally {
      setLoading(false);
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
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="flex space-x-2 p-4">
                    {shelter.gallery_images && shelter.gallery_images.length > 0 ? (
                      shelter.gallery_images.slice(0, 2).map((imageUrl, index) => (
                        <div key={index} className="relative w-1/2 h-48">
                          <Image
                            src={imageUrl}
                            alt={`Imagem ${index + 1} do abrigo ${shelter.responsible_name}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Sem imagens</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {shelter.description || 'Sem descrição disponível'}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                    {/*   <Link
                        href={`/doar/${shelter.id}`}
                        className="flex-1 text-center px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-800 transition-colors"
                      >
                        Doar
                      </Link> */}
                      <Link
                        href={`/voluntario/${shelter.id}`}
                        className="flex-1 text-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Voluntariar-se
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {shelters.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum abrigo cadastrado ainda.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}