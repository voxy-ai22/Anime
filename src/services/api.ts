import { AnimeSearchResponse, AnimeDetailResponse, AnimeStreamResponse } from '../types';

const BASE_URL = '/api/anime';

export const animeApi = {
  search: async (query: string): Promise<AnimeSearchResponse> => {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    return response.json();
  },
  getDetail: async (bookUrl: string): Promise<AnimeDetailResponse> => {
    const response = await fetch(`${BASE_URL}/detail?bookUrl=${encodeURIComponent(bookUrl)}`);
    return response.json();
  },
  getStream: async (episodeUrl: string): Promise<AnimeStreamResponse> => {
    const response = await fetch(`${BASE_URL}/stream?episodeUrl=${encodeURIComponent(episodeUrl)}`);
    const data = await response.json();
    
    // Attempt to normalize or "convert" stream URL if it's a known embed platform
    if (data.success && data.data && data.data.streamUrl) {
      console.log("Original Stream URL:", data.data.streamUrl);
    }
    
    return data;
  }
};

export const neoxrApi = {
  search: async (query: string) => {
    const response = await fetch(`/api/neoxr/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },
  detail: async (url: string) => {
    const response = await fetch(`/api/neoxr/get?url=${encodeURIComponent(url)}`);
    return response.json();
  },
  stream: async (url: string) => {
    const response = await fetch(`/api/neoxr/stream?url=${encodeURIComponent(url)}`);
    return response.json();
  }
};
