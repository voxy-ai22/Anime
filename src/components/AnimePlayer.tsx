import { motion } from 'motion/react';
import { X, Maximize2, ShieldCheck, Info } from 'lucide-react';
import { AnimeEpisode } from '../types';

interface AnimePlayerProps {
  streamUrl: string;
  episode: AnimeEpisode;
  onClose: () => void;
}

export const AnimePlayer = ({ streamUrl, episode, onClose }: AnimePlayerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4"
    >
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F27D26] rounded-xl flex items-center justify-center border border-white/20 accent-glow">
              <Play className="h-6 w-6 text-black fill-black ml-1" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight line-clamp-1">{episode.title}</h2>
              <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse"></span>
                Secure Video Pipeline Active
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="glass p-3 rounded-xl hover:bg-[#F27D26] hover:text-black transition-all border-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative aspect-video glass rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <iframe
            src={streamUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            scrolling="no"
          />
        </div>

        <div className="flex items-center justify-between px-4">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F27D26]">
               <ShieldCheck className="h-4 w-4" />
               Premium Node
             </div>
             <div className="w-1 h-1 bg-white/10 rounded-full"></div>
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
               <Maximize2 className="h-4 w-4" />
               Auto 1080p
             </div>
           </div>
           <div className="text-[10px] font-mono text-white/20 uppercase">
             {new Date().toLocaleTimeString()} :: Server Region: Asia-East
           </div>
        </div>
      </div>
    </motion.div>
  );
};
