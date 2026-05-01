/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { AnimeCard } from './components/AnimeCard';
import { AnimeDetail } from './components/AnimeDetail';
import { AnimePlayer } from './components/AnimePlayer';
import { animeApi, neoxrApi } from './services/api';
import { AnimeSearchItem, AnimeDetail as AnimeDetailType, AnimeEpisode } from './types';
import { GENRES, POPULAR_FEATURED } from './constants';
import { Loader2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

export default function App() {
  const [results, setResults] = useState<AnimeSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<AnimeDetailType | null>(null);
  const [streamingInfo, setStreamingInfo] = useState<{ url: string; episode: AnimeEpisode } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<AnimeSearchItem[]>(() => {
    const saved = localStorage.getItem('nx_favorites') || Cookies.get('nx_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState<AnimeSearchItem[]>(() => {
    const saved = localStorage.getItem('nx_history') || Cookies.get('nx_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const data = JSON.stringify(favorites);
    localStorage.setItem('nx_favorites', data);
    Cookies.set('nx_favorites', data, { expires: 365 });
  }, [favorites]);

  useEffect(() => {
    const data = JSON.stringify(history);
    localStorage.setItem('nx_history', data);
    Cookies.set('nx_history', data, { expires: 30 });
  }, [history]);

  // Initial load: Search for multiple categories to "load all" as much as possible
  useEffect(() => {
    fetchAllAnime();
  }, []);

  const fetchAllAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const seenUrls = new Set<string>();
      const allResults: AnimeSearchItem[] = [...POPULAR_FEATURED];
      
      allResults.forEach(item => seenUrls.add(item.bookUrl));

      const queries = ['trend', 'terbaru', 'drama', 'action'];
      // Load from NexaNime (FerDev)
      for (const query of queries) {
        try {
          const data = await animeApi.search(query);
          if (data.success && data.result) {
            data.result.forEach(item => {
              if (!seenUrls.has(item.bookUrl)) {
                seenUrls.add(item.bookUrl);
                allResults.push(item);
              }
            });
          }
        } catch (e) {
          console.warn(`FerDev fetch failed for ${query}:`, e);
        }
      }

      // Load from Otakudesu (Neoxr) - additional sources
      const neoxrQueries = ['anime', 'one piece'];
      for (const query of neoxrQueries) {
        try {
          const neoxrData = await neoxrApi.search(query);
          if (neoxrData.status && neoxrData.data) {
            neoxrData.data.forEach((item: any) => {
              const mappedItem: AnimeSearchItem = {
                title: item.title,
                image: item.thumbnail,
                bookUrl: item.url,
                status: item.status || 'Otakudesu',
                type: item.type || 'Anime'
              };
              if (!seenUrls.has(mappedItem.bookUrl)) {
                seenUrls.add(mappedItem.bookUrl);
                allResults.push(mappedItem);
              }
            });
          }
        } catch (e) {
          console.warn(`Neoxr fetch failed for ${query}:`, e);
        }
      }

      if (allResults.length > 0) {
        setResults(allResults);
      } else {
        setError('Gagal memuat database anime. Silakan coba Re-sync.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan sistem saat memuat database.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchAllAnime();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const combinedResults: AnimeSearchItem[] = [];
      const seenUrls = new Set<string>();

      // Try FerDev search
      try {
        const data = await animeApi.search(query);
        if (data.success && data.result) {
          data.result.forEach(item => {
            if (!seenUrls.has(item.bookUrl)) {
              seenUrls.add(item.bookUrl);
              combinedResults.push(item);
            }
          });
        }
      } catch (err) {
        console.warn('FerDev search failed:', err);
      }

      // Try Neoxr search
      try {
        const neoxrData = await neoxrApi.search(query);
        if (neoxrData.status && neoxrData.data) {
          neoxrData.data.forEach((item: any) => {
            const mapped: AnimeSearchItem = {
              title: item.title,
              image: item.thumbnail,
              bookUrl: item.url,
              status: item.status || 'Otakudesu',
              type: item.type || 'Anime'
            };
            if (!seenUrls.has(mapped.bookUrl)) {
              seenUrls.add(mapped.bookUrl);
              combinedResults.push(mapped);
            }
          });
        }
      } catch (err) {
        console.warn('Neoxr search failed:', err);
      }

      if (combinedResults.length > 0) {
        setResults(combinedResults);
      } else {
        setError('Pencarian tidak menemukan hasil di sumber manapun.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses pencarian.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (anime: AnimeSearchItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.bookUrl === anime.bookUrl);
      if (exists) {
        return prev.filter(f => f.bookUrl !== anime.bookUrl);
      }
      return [anime, ...prev].slice(0, 50); // Limit to 50
    });
  };

  const addToHistory = (anime: AnimeSearchItem) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.bookUrl !== anime.bookUrl);
      return [anime, ...filtered].slice(0, 20); // Limit to 20
    });
  };

  const handleCardClick = async (anime: AnimeSearchItem) => {
    setLoading(true);
    addToHistory(anime);
    try {
      // Check if it's an Otakudesu URL or FerDev
      if (anime.bookUrl.includes('otakudesu')) {
        const data = await neoxrApi.detail(anime.bookUrl);
        if (data.status && data.data) {
          // Map Neoxr detail to our Detail Type
          const item = data.data;
          const mapped: AnimeDetailType = {
            success: true,
            title: item.title,
            image: item.thumbnail,
            sinopsis: item.synopsis || 'No description available.',
            genres: item.genres?.map((g: any) => g.name) || [],
            rating: item.rating || 0,
            bookmarkCount: 0,
            totalEpisodes: item.episodes?.length || 0,
            url: item.url,
            info: {
              Tipe: item.type || 'N/A',
              Status: item.status || 'N/A',
              Studio: item.studio || 'N/A',
              Dirilis: item.release || 'N/A',
              Durasi: item.duration || 'N/A',
              Season: (item.release?.match(/\d{4}/) || ['N/A'])[0],
              Episode: item.episode || item.episodes?.length.toString() || '0',
              Producers: item.producer || 'N/A',
              Casts: 'N/A',
              "Diposting oleh": 'System',
              "Diperbarui pada": 'Recently',
              Genre: item.genre || item.genres?.map((g: any) => g.name).join(', ') || 'N/A'
            },
            episodes: item.episodes?.flatMap((cat: any) => 
              cat.lists?.map((ep: any) => ({
                episode: (ep.episode.match(/\d+/) || ['0'])[0],
                title: ep.episode,
                episodeUrl: ep.url,
                date: ep.release || ''
              })) || []
            ) || []
          };
          setSelectedDetail(mapped);
        }
      } else {
        const data = await animeApi.getDetail(anime.bookUrl);
        if (data.success) {
          setSelectedDetail(data.result);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEpisode = async (episode: AnimeEpisode) => {
    setLoading(true);
    try {
      if (episode.episodeUrl.includes('otakudesu')) {
        const data = await neoxrApi.stream(episode.episodeUrl);
        if (data.status && data.data) {
          // Neoxr typically returns an object with url or qualities
          const streamUrl = data.data.url || (Array.isArray(data.data) ? data.data[0]?.url : null);
          if (streamUrl) {
            setStreamingInfo({ url: streamUrl, episode });
          } else {
            setError('Gagal mendapatkan link streaming Otakudesu.');
          }
        } else {
          setError('Gagal mendapatkan data streaming.');
        }
      } else {
        const data = await animeApi.getStream(episode.episodeUrl);
        if (data.success && data.data) {
          setStreamingInfo({ url: data.data.streamUrl, episode });
        }
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat video player.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative z-10">
      <Header onSearch={handleSearch} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Genre Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar no-scrollbar">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => genre !== 'All' ? handleSearch(genre) : fetchAllAnime()}
              className="whitespace-nowrap px-4 py-2 glass-card text-[10px] uppercase font-bold tracking-widest hover:bg-[#F27D26] hover:text-black transition-all"
            >
              {genre}
            </button>
          ))}
        </div>

        {favorites.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center glass rounded-lg border-[#F27D26]/20">
                <Sparkles className="h-6 w-6 text-[#F27D26]" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">Your Favorites</h2>
                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Saved collections</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favorites.map((anime) => (
                <AnimeCard 
                  key={`fav-${anime.bookUrl}`} 
                  anime={anime} 
                  onClick={handleCardClick} 
                />
              ))}
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center glass rounded-lg border-white/10">
                <Loader2 className="h-6 w-6 text-white/60" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">Recently Viewed</h2>
                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Continue where you left off</p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {history.map((anime) => (
                <div key={`hist-${anime.bookUrl}`} className="w-32 flex-shrink-0">
                  <AnimeCard 
                    anime={anime} 
                    onClick={handleCardClick} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F27D26] p-2 glass rounded-lg border-[#F27D26]/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-black" />
                </div>
               <div>
                 <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
                   {loading && results.length === 0 ? 'Loading Database...' : 'Popular Recommendations'}
                 </h2>
                 <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Syncing with global index</p>
               </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F27D26] glass px-4 py-2 rounded-lg border-[#F27D26]/20 bg-[#F27D26]/5 shadow-[0_0_20px_rgba(242,125,38,0.1)]">
               <Sparkles className="h-3 w-3" />
               Daily Refined
             </div>
          </div>

          {loading && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-[#F27D26] animate-spin" />
                <div className="absolute inset-0 bg-[#F27D26]/20 blur-xl animate-pulse rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold uppercase tracking-[0.3em] text-sm mb-1">Establishing Connection</p>
                <p className="text-white/20 font-mono text-[10px] uppercase">Retrieving metadata clusters...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 glass rounded-xl border-red-500/20 bg-red-500/5">
               <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
               <h3 className="text-white font-bold uppercase tracking-widest mb-2">Sync Error</h3>
               <p className="text-red-400/80 text-xs font-medium max-w-xs text-center leading-relaxed">{error}</p>
               <button onClick={() => handleSearch('populer')} className="mt-8 px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#F27D26] hover:text-black hover:border-[#F27D26] transition-all">Re-sync Engine</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-x-8 md:gap-y-12">
              {results.map((anime) => (
                <AnimeCard 
                  key={anime.bookUrl} 
                  anime={anime} 
                  onClick={handleCardClick} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {selectedDetail && (
          <AnimeDetail 
            detail={selectedDetail} 
            isFavorite={favorites.some(f => f.bookUrl === selectedDetail.url)}
            onToggleFavorite={() => {
              const item: AnimeSearchItem = {
                title: selectedDetail.title,
                image: selectedDetail.image,
                bookUrl: selectedDetail.url,
                status: selectedDetail.info.Status,
                type: selectedDetail.info.Tipe
              };
              toggleFavorite(item);
            }}
            onClose={() => setSelectedDetail(null)} 
            onSelectEpisode={handleSelectEpisode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {streamingInfo && (
          <AnimePlayer 
            streamUrl={streamingInfo.url} 
            episode={streamingInfo.episode}
            onClose={() => setStreamingInfo(null)}
          />
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (selectedDetail || streamingInfo || (results.length > 0 && !error)) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none"
          >
            <div className="glass p-5 rounded-xl border-[#F27D26]/30 shadow-2xl">
              <Loader2 className="h-8 w-8 text-[#F27D26] animate-spin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1a1c2c]/40 rounded-full blur-[140px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#2a1b14]/40 rounded-full blur-[140px] pointer-events-none z-[-1]" />
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-[100] bg-[length:100%_4px,3px_100%] opacity-20"></div>
    </div>
  );
}
