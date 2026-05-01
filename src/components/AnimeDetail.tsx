import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Calendar, Clock, Tv, Play, ChevronRight } from 'lucide-react';
import { AnimeDetail as AnimeDetailType, AnimeEpisode } from '../types';

interface AnimeDetailProps {
  detail: AnimeDetailType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  onSelectEpisode: (episode: AnimeEpisode) => void;
}

export const AnimeDetail = ({ detail, isFavorite, onToggleFavorite, onClose, onSelectEpisode }: AnimeDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass w-full max-w-5xl rounded-xl overflow-hidden relative min-h-[70vh] border-white/10"
      >
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <button 
            onClick={onToggleFavorite}
            className={`glass p-2 rounded-lg transition-all ${isFavorite ? 'bg-[#F27D26] text-black shadow-[0_0_20px_rgba(242,125,38,0.4)]' : 'hover:bg-white/10 text-white'}`}
          >
            <Star className={`h-5 w-5 ${isFavorite ? 'fill-black' : ''}`} />
          </button>
          <button 
            onClick={onClose}
            className="glass p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Poster Section */}
          <div className="w-full md:w-80 p-6 md:p-8 shrink-0">
            <div className="sticky top-8">
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 shadow-2xl relative group">
                <img 
                  src={detail.image} 
                  alt={detail.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-2 left-2 bg-[#F27D26] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                  {detail.info.Tipe}
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {detail.genres.map(genre => (
                  <span key={genre} className="text-[10px] uppercase tracking-wider font-semibold text-white/40 border border-white/10 px-2 py-1 rounded">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-3 bg-white/5 p-4 rounded-lg border border-white/10 font-mono text-[11px] uppercase tracking-wider text-white/60">
                <div className="flex items-center justify-between">
                  <span>STUDIO</span>
                  <span className="text-[#F27D26]">{detail.info.Studio}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SEASON</span>
                  <span className="text-[#F27D26]">{detail.info.Season}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>STATUS</span>
                  <span className="text-[#F27D26]">{detail.info.Status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 p-6 md:p-8 md:pl-0 flex flex-col min-h-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-yellow-400 text-sm font-bold">
                <Star className="h-4 w-4 fill-yellow-400" />
                <span>{detail.rating} Rating</span>
                <span className="text-white/20 ml-2">|</span>
                <span className="text-white/40 ml-2">{detail.info.Episode} Episodes</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase mb-4 leading-tight">{detail.title}</h1>
              <p className="text-xs text-white/40 font-medium flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Released on {detail.info.Dirilis}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F27D26] mb-3">Synopsis</h2>
              <p className="text-white/60 leading-relaxed text-sm">
                {detail.sinopsis}
              </p>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F27D26]">Episode List</h2>
                <span className="text-[10px] text-white/30 font-mono uppercase">{detail.totalEpisodes} Items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {detail.episodes.map((ep, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectEpisode(ep)}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:border-[#F27D26]/40 hover:bg-white/10 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10 text-white text-[10px] font-bold flex items-center justify-center group-hover:bg-[#F27D26] group-hover:text-black transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <span className="text-xs font-medium text-white/80 line-clamp-1">{ep.title}</span>
                    </div>
                    <Play className="h-3 w-3 text-white/20 group-hover:text-[#F27D26] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
