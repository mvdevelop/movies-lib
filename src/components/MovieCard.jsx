
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock, Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
  // Dados de exemplo para demonstração
  const movieData = {
    id: movie?.id || 1,
    title: movie?.title || 'Título do Filme',
    poster: movie?.poster || 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=Poster',
    rating: movie?.rating || 7.8,
    year: movie?.year || 2024,
    duration: movie?.duration || '2h 15m',
    genre: movie?.genre || ['Ação', 'Aventura'],
    description: movie?.description || 'Uma breve descrição do filme vai aqui...'
  }

  return (
    <Link 
      to={`/movie/${movieData.id}`}
      className="movie-card group block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Poster Image */}
      <div className="relative overflow-hidden">
        <img 
          src={movieData.poster} 
          alt={movieData.title}
          className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay com Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition">
              <Play size={20} />
              <span>Assistir Trailer</span>
            </button>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
          <Star className="text-yellow-400" size={16} fill="currentColor" />
          <span className="font-bold text-white">{movieData.rating}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-300 transition">
          {movieData.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{movieData.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{movieData.duration}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400" size={14} fill="currentColor" />
            <span>{movieData.rating}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="mt-3 flex flex-wrap gap-2">
          {movieData.genre.map((genre, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-300 line-clamp-2">
          {movieData.description}
        </p>

        {/* View Details Button */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <button className="w-full py-2 text-center text-purple-400 hover:text-white hover:bg-purple-900/30 rounded-lg transition">
            Ver Detalhes
          </button>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard;
