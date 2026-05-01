import { AnimeSearchResponse, AnimeDetailResponse, AnimeStreamResponse } from '../types';

const API_KEY = 'RS-gt81t3w1dg';
const BASE_URL = 'https://api.ferdev.my.id/internet/animekuindo';

export const animeApi = {
  search: async (query: string): Promise<AnimeSearchResponse> => {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    return response.json();
  },
  getDetail: async (bookUrl: string): Promise<AnimeDetailResponse> => {
    const response = await fetch(`${BASE_URL}/detail?bookUrl=${encodeURIComponent(bookUrl)}&apikey=${API_KEY}`);
    return response.json();
  },
  getStream: async (episodeUrl: string): Promise<AnimeStreamResponse> => {
    const response = await fetch(`${BASE_URL}/stream?episodeUrl=${encodeURIComponent(episodeUrl)}&apikey=${API_KEY}`);
    return response.json();
  }
};
