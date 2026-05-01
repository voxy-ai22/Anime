import { motion } from 'motion/react';
import { Search, Popcorn } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 glass px-6 py-3 rounded-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          <div className="w-10 h-10 bg-[#F27D26] rounded-lg flex items-center justify-center font-bold text-black accent-glow ring-1 ring-white/20">
            AK
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">
            AnimeKu<span className="text-[#F27D26]">.indo</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md relative group mx-4 md:mx-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime (e.g. Chitose-kun)"
            className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F27D26] transition-all placeholder:text-white/20"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-[#F27D26] transition-colors" />
        </form>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-[#F27D26] hover:text-white transition-colors">Popular</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Schedule</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Genres</a>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F27D26] to-red-500 border border-white/20 accent-glow"></div>
        </div>
      </div>
    </header>
  );
};
