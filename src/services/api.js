
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API.replace('/movie', '');
const IMG_BASE_URL = import.meta.env.VITE_IMG;
const SEARCH_URL = import.meta.env.VITE_SEARCH;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
});

export const tmdbApi = {
  // Filmes populares
  getPopularMovies: (page = 1) => 
    api.get('/movie/popular', { params: { page } }),
  
  // Filmes em cartaz
  getNowPlaying: (page = 1) => 
    api.get('/movie/now_playing', { params: { page } }),
  
  // Próximos lançamentos
  getUpcoming: (page = 1) => 
    api.get('/movie/upcoming', { params: { page } }),
  
  // Melhores avaliados
  getTopRated: (page = 1) => 
    api.get('/movie/top_rated', { params: { page } }),
  
  // Detalhes do filme
  getMovieDetails: (id) => 
    api.get(`/movie/${id}`, { 
      params: { 
        append_to_response: 'credits,videos,similar' 
      }
    }),
  
  // Buscar filmes
  searchMovies: (query, page = 1) => 
    api.get(SEARCH_URL.replace(BASE_URL, ''), { 
      params: { query, page } 
    }),
  
  // Gêneros
  getGenres: () => 
    api.get('/genre/movie/list'),
  
  // Filmes por gênero
  getMoviesByGenre: (genreId, page = 1) =>
    api.get('/discover/movie', { 
      params: { 
        with_genres: genreId, 
        page 
      }
    })
};

// Helper para imagens
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a2e/ffffff?text=No+Image';
  return `${IMG_BASE_URL.replace('/w500/', `/${size}/`)}${path}`;
};

// Helper para vídeos do YouTube
export const getTrailerUrl = (videos) => {
  if (!videos || !videos.results || videos.results.length === 0) return null;
  const trailer = videos.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};
