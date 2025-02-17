import Link from 'next/link';

export default function Header({ showTitle = true, showButton = true }) {
  return (
    <header className="bg-emerald-700 text-white h-16">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">

        {showTitle && (
          <Link
            href="/">
            <div className="text-sm font-medium">
              UNIDOS CONTRA A FOME: UMA LUTA DIÁRIA
            </div>
          </Link>
        )}

        {showButton && (
          <Link 
            href="/entrar" 
            className="bg-gray-800 hover:bg-gray-700 transition-colors text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>Participar</span>
          </Link>
        )}
        
      </div>
    </header>
  );
}
