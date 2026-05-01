import { motion } from 'motion/react';
import { AnimeSearchItem } from '../types';
import { Play } from 'lucide-react';

interface AnimeCardProps {
  anime: AnimeSearchItem;
  onClick: (anime: AnimeSearchItem) => void;
  key?: string | number;
}

export const AnimeCard = ({ anime, onClick }: AnimeCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group relative cursor-pointer"
      onClick={() => onClick(anime)}
    >
      <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-glass)] glass-card relative bg-zinc-900 border-white/10 group-hover:border-[#F27D26]/30">
        <img
          src={anime.image}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-[#F27D26]/90 rounded-lg backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="text-black fill-black h-6 w-6 ml-1" />
          </div>
        </div>
        
        {anime.type && (
          <div className="absolute top-2 left-2 bg-[#F27D26] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
            {anime.type}
          </div>
        )}
        
        {anime.status && (
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${anime.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-white/10 text-white border-white/20'}`}>
            {anime.status}
          </div>
        )}
      </div>
      <div className="mt-3 px-1 text-center md:text-left">
        <h3 className="text-xs font-bold text-white/80 line-clamp-2 leading-snug group-hover:text-[#F27D26] transition-colors uppercase tracking-tight">
          {anime.title}
        </h3>
      </div>
    </motion.div>
  );
};
