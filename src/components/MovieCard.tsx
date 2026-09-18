import { Link } from 'react-router-dom';
import { Star, Calendar, Clock, Play } from 'lucide-react';
import { getImageUrl } from '../services/api';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  showLink?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showLink = true }) => {
  if (!movie) return null;

  // Formatar dados do filme com fallback seguro
  const title: string = movie.title || movie.original_title || 'Título desconhecido';
  const poster: string = movie.poster_path
    ? getImageUrl(movie.poster_path)
    : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image';
  const rating: string = movie.vote_average !== undefined ? movie.vote_average.toFixed(1) : 'N/A';
  const year: string = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const duration: string = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';
  const genres: string[] =
    movie.genre_names || movie.genres?.map((g) => g.name) || [];

  const content = (
    <>
      {/* Poster Image */}
      <div className="relative overflow-hidden aspect-[2/3] rounded-xl">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image';
          }}
        />

        {/* Overlay com Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition"
              aria-label={`Ver detalhes de ${title}`}
            >
              <Play size={20} />
              <span>Ver Detalhes</span>
            </button>
          </div>
        </div>

        {/* Rating Badge */}
        {rating !== 'N/A' && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
            <Star className="text-yellow-400" size={16} fill="currentColor" />
            <span className="font-bold text-white">{rating}</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-300 transition">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-2 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{year}</span>
            </div>
            {duration !== 'N/A' && (
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{duration}</span>
              </div>
            )}
          </div>

          {rating !== 'N/A' && (
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400" size={14} fill="currentColor" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300"
              >
                {genre}
              </span>
            ))}
            {genres.length > 2 && (
              <span className="px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300">
                +{genres.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="mt-3 text-sm text-gray-300 line-clamp-2">
          {movie.overview || 'Sinopse não disponível.'}
        </p>

        {/* View Details Button */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <button className="w-full py-2 text-center text-purple-400 hover:text-white hover:bg-purple-900/30 rounded-lg transition">
            Ver Detalhes
          </button>
        </div>
      </div>
    </>
  );

  if (!showLink) {
    return (
      <div className="movie-card group block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 h-full">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-card group block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 h-full"
      aria-label={`Ver detalhes de ${title}`}
    >
      {content}
    </Link>
  );
};

export default MovieCard;
