export interface AnimeSearchItem {
  title: string;
  bookUrl: string;
  image: string;
  status: string | null;
  type: string;
}

export interface AnimeSearchResponse {
  success: boolean;
  status: number;
  author: string;
  result: AnimeSearchItem[];
}

export interface AnimeEpisode {
  episode: string;
  title: string;
  episodeUrl: string;
  date: string;
}

export interface AnimeDetail {
  success: boolean;
  title: string;
  image: string;
  info: {
    Status: string;
    Studio: string;
    Dirilis: string;
    Durasi: string;
    Season: string;
    Tipe: string;
    Episode: string;
    Producers: string;
    Casts: string;
    "Diposting oleh": string;
    "Diperbarui pada": string;
  };
  genres: string[];
  sinopsis: string;
  rating: number;
  bookmarkCount: number | null;
  totalEpisodes: number;
  episodes: AnimeEpisode[];
  url: string;
}

export interface AnimeDetailResponse {
  success: boolean;
  status: number;
  author: string;
  result: AnimeDetail;
}

export interface AnimeStreamData {
  success: boolean;
  streamUrl: string;
  mirrorStreams: any[];
}

export interface AnimeStreamResponse {
  success: boolean;
  status: number;
  author: string;
  data: AnimeStreamData;
}
