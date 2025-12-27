
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Play, Star, Clock, Calendar, Users, 
  ThumbsUp, Bookmark, Share2, ChevronRight 
} from 'lucide-react';
import MovieCard from '../components/MovieCard';

const Movie = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedMovies, setRelatedMovies] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  // Dados de exemplo para o filme
  const movieData = {
    id: parseInt(id) || 1,
    title: 'Duna: Parte Dois',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920',
    rating: 8.7,
    year: 2024,
    duration: '2h 46m',
    genre: ['Ficção Científica', 'Aventura', 'Drama'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'],
    description: 'Paul Atreides se une a Chani e aos Fremen em sua guerra de vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo conhecido, ele se esforça para evitar um futuro terrível que só ele pode prever.',
    plot: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo conhecido, ele se esforça para evitar um futuro terrível que só ele pode prever.',
    reviews: 1245,
    popularity: 98
  }

  const relatedMoviesData = [
    { id: 2, title: 'Duna', rating: 8.0, year: 2021 },
    { id: 3, title: 'Blade Runner 2049', rating: 8.0, year: 2017 },
    { id: 4, title: 'Arrival', rating: 7.9, year: 2016 },
    { id: 5, title: 'Interestelar', rating: 8.6, year: 2014 },
    { id: 6, title: 'Gravidade', rating: 7.7, year: 2013 },
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setMovie(movieData)
      setRelatedMovies(relatedMoviesData)
      setLoading(false)
    }, 800)
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </Link>

      {/* Movie Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div 
          className="h-96 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)), url(${movie.backdrop})`
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0">
            {/* Poster */}
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="w-48 h-64 rounded-xl shadow-2xl"
            />
            
            {/* Movie Info */}
            <div className="md:ml-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title} <span className="text-gray-400">({movie.year})</span></h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="text-yellow-400" size={18} fill="currentColor" />
                  <span className="font-bold">{movie.rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{movie.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>{movie.year}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users size={18} />
                  <span>{movie.reviews.toLocaleString()} reviews</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-900/50 backdrop-blur-sm rounded-full text-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center space-x-2 hover:opacity-90 transition">
                  <Play size={20} />
                  <span className="font-semibold">Assistir Trailer</span>
                </button>
                
                <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition">
                  <Bookmark size={20} />
                  <span>Adicionar à Lista</span>
                </button>
                
                <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition">
                  <ThumbsUp size={20} />
                  <span>Avaliar</span>
                </button>
                
                <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition">
                  <Share2 size={20} />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-800">
        <div className="flex space-x-8">
          {['overview', 'cast', 'reviews', 'details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium text-lg capitalize transition ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'overview' ? 'Visão Geral' :
               tab === 'cast' ? 'Elenco' :
               tab === 'reviews' ? 'Avaliações' : 'Detalhes'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Sinopse</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {movie.plot}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800/50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-2">Diretor</h4>
                  <p className="text-purple-400">{movie.director}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-2">Popularidade</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${movie.popularity}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 font-bold">{movie.popularity}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'cast' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Elenco Principal</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {movie.cast.map((actor, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                      {actor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h4 className="font-semibold text-white">{actor}</h4>
                    <p className="text-gray-400 text-sm">Personagem</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              Filmes Relacionados
              <ChevronRight className="ml-2" size={20} />
            </h3>
            
            <div className="space-y-4">
              {relatedMovies.map((related) => (
                <Link
                  key={related.id}
                  to={`/movie/${related.id}`}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-700/50 rounded-lg transition group"
                >
                  <div className="w-16 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Play className="text-gray-400 group-hover:text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-purple-300 transition">
                      {related.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                      <span>{related.year}</span>
                      <span className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={12} fill="currentColor" />
                        {related.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 text-center text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition">
              Ver Mais Filmes
            </button>
          </div>
        </div>
      </div>

      {/* Similar Movies Grid */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Você Também Pode Gostar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedMoviesData.map((movie) => (
            <div key={movie.id} className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-700/50 transition group">
              <Link to={`/movie/${movie.id}`} className="block">
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg mb-3 group-hover:opacity-80 transition"></div>
                <h3 className="font-semibold text-white truncate">{movie.title}</h3>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-400">{movie.year}</span>
                  <span className="flex items-center text-yellow-400">
                    <Star size={12} fill="currentColor" className="mr-1" />
                    {movie.rating}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Movie;
