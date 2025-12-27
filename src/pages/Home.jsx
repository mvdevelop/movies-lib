
import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { tmdbApi, getImageUrl } from '../services/api';
import { Play, TrendingUp, Filter, Sparkles, Loader, AlertCircle } from 'lucide-react';

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [popularMovies, setPopularMovies] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [topRated, setTopRated] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('popular')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Buscar dados em paralelo
        const [
          popularRes,
          nowPlayingRes,
          topRatedRes,
          genresRes
        ] = await Promise.all([
          tmdbApi.getPopularMovies(),
          tmdbApi.getNowPlaying(),
          tmdbApi.getTopRated(),
          tmdbApi.getGenres()
        ])

        const popular = popularRes.data.results
        const playing = nowPlayingRes.data.results
        const top = topRatedRes.data.results
        
        // Definir filme em destaque
        if (playing.length > 0) {
          setFeaturedMovie(playing[0])
        } else if (popular.length > 0) {
          setFeaturedMovie(popular[0])
        }
        
        setPopularMovies(popular)
        setNowPlaying(playing)
        setTopRated(top)
        setGenres(genresRes.data.genres.slice(0, 12))
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Erro ao carregar dados da API. Verifique sua conexão e a chave da API.')
        // Dados de fallback para desenvolvimento
        setFallbackData()
      } finally {
        setLoading(false)
      }
    }

    // Função de fallback para desenvolvimento
    const setFallbackData = () => {
      const fallbackMovie = {
        id: 1,
        title: 'Filme de Exemplo',
        backdrop_path: '/example.jpg',
        vote_average: 7.5,
        release_date: '2024-01-01',
        overview: 'Este é um filme de exemplo para demonstração.',
        genre_ids: [28]
      }
      
      setFeaturedMovie(fallbackMovie)
      
      const fallbackMovies = Array.from({length: 10}, (_, i) => ({
        id: i + 1,
        title: `Filme Exemplo ${i + 1}`,
        poster_path: null,
        vote_average: 7 + (i * 0.1),
        release_date: '2024-01-01',
        overview: 'Descrição do filme exemplo.',
        genre_ids: [28, 35]
      }))
      
      setPopularMovies(fallbackMovies)
      setNowPlaying(fallbackMovies)
      setTopRated(fallbackMovies)
      setGenres([
        { id: 28, name: 'Ação' },
        { id: 35, name: 'Comédia' },
        { id: 18, name: 'Drama' },
        { id: 878, name: 'Ficção Científica' },
        { id: 27, name: 'Terror' },
        { id: 10749, name: 'Romance' }
      ])
    }

    fetchData()
  }, [])

  const getMoviesByCategory = () => {
    switch(activeCategory) {
      case 'popular': return popularMovies
      case 'nowPlaying': return nowPlaying
      case 'topRated': return topRated
      default: return popularMovies
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar dados</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{error}</p>
        <p className="text-gray-500 text-sm">
          Verifique se sua chave da API no arquivo .env está correta.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Hero Section - Featured Movie */}
      {featuredMovie && (
        <section className="relative rounded-2xl overflow-hidden mb-12">
          <div 
            className="h-[500px] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${getImageUrl(featuredMovie.backdrop_path, 'original')})`
            }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-8">
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">EM DESTAQUE</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    {featuredMovie.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <span className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-400">
                        {featuredMovie.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-gray-300">/10</span>
                    </span>
                    <span className="text-gray-300">
                      {featuredMovie.release_date?.substring(0, 4) || 'N/A'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-8 line-clamp-3">
                    {featuredMovie.overview || 'Descrição não disponível.'}
                  </p>
                  
                  <div className="flex space-x-4">
                    <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center space-x-2 hover:opacity-90 transition">
                      <Play size={24} />
                      <span className="font-semibold">Ver Detalhes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs */}
      <section className="mb-8">
        <div className="flex items-center space-x-6 mb-6">
          <TrendingUp className="text-purple-400" size={28} />
          <h2 className="text-3xl font-bold text-white">Explorar Filmes</h2>
        </div>
        
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'popular', label: 'Populares' },
            { id: 'nowPlaying', label: 'Em Cartaz' },
            { id: 'topRated', label: 'Melhores Avaliados' }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {getMoviesByCategory().slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {getMoviesByCategory().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum filme encontrado.</p>
          </div>
        )}
      </section>

      {/* Genres */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Gêneros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 hover:transform hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <span className="text-white font-medium group-hover:text-purple-300 transition">
                {genre.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home;
