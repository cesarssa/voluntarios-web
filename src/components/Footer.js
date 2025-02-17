import { FacebookIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-gray-300">
            <FacebookIcon size={24} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <LinkedinIcon size={24} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <YoutubeIcon size={24} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <InstagramIcon size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
