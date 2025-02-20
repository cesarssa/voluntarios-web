// components/Sidebar.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Heart, User, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Erro ao fazer logout');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <nav className="flex flex-col h-full justify-between py-4">
        <div className="space-y-2 px-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg"
          >
            <Home className="w-6 h-6 text-emerald-700" />
            <span>Início</span>
          </Link>

          <Link
            href="/listar-abrigos"
            className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg"
          >
            <Heart className="w-6 h-6 text-emerald-700" />
            <span>Quero Ser Voluntário</span>
          </Link>

          <Link
            href="/perfil"
            className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg"
          >
            <User className="w-6 h-6 text-emerald-700" />
            <span>Conta</span>
          </Link>

          <Link
            href="/abrigo"
            className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg"
          >
            <Settings className="w-6 h-6 text-emerald-700" />
            <span>Cadastrar Abrigo</span>
          </Link>
        </div>

        <div className="px-4">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg w-full"
          >
            <LogOut className="w-6 h-6 text-emerald-700" />
            <span>Sair</span>
          </button>
        </div>
      </nav>
    </div>
  );
}