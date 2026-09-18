import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Star,
  Clock,
  Calendar,
  Users,
  Bookmark,
  ThumbsUp,
  Share2,
  ChevronRight,
  Globe,
  Film,
  Award,
  Tag,
  Loader,
  AlertCircle,
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { tmdbApi, getImageUrl, getTrailerUrl } from '../services/api';
import type { Movie, CastMember, CrewMember, ProductionCompany } from '../types';

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'details'>('overview');
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.getMovieDetails(id);
        const data: Movie = response.data;

        setMovie(data);

        // Extrair URL do trailer
        if (data.videos) {
          setTrailerUrl(getTrailerUrl(data.videos));
        }

        // Filmes similares
        if (data.similar?.results) {
          setSimilarMovies(data.similar.results.slice(0, 5));
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do filme:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchMovieDetails();
  }, [id]);

  const formatCurrency = (amount?: number): string => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes?: number | null): string => {
    if (!minutes || minutes <= 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">
          Filme não encontrado
        </h2>
        <Link
          to="/"
          className="text-purple-400 hover:text-purple-300 transition"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'cast', label: 'Elenco' },
    { id: 'details', label: 'Detalhes' },
  ] as const;

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
            backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)), url(${
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : 'https://via.placeholder.com/1920x500/0f0f1a/ffffff?text=No+Backdrop'
            })`,
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0">
            {/* Poster */}
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-48 h-64 rounded-xl shadow-2xl object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image';
              }}
            />

            {/* Movie Info */}
            <div className="md:ml-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {movie.title}{' '}
                <span className="text-gray-400">
                  ({movie.release_date?.substring(0, 4)})
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star
                    className="text-yellow-400"
                    size={18}
                    fill="currentColor"
                  />
                  <span className="font-bold">
                    {movie.vote_average
                      ? movie.vote_average.toFixed(1)
                      : 'N/A'}
                  </span>
                  <span className="text-gray-400">/10</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>{movie.release_date || 'N/A'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users size={18} />
                  <span>
                    {movie.vote_count?.toLocaleString() || 0} votos
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-purple-900/50 backdrop-blur-sm rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-gray-300 italic mb-4">
                  "{movie.tagline}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center space-x-2 hover:opacity-90 transition"
                  >
                    <Play size={20} />
                    <span className="font-semibold">Assistir Trailer</span>
                  </a>
                )}

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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-medium text-lg capitalize transition ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
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
                {movie.overview || 'Sinopse não disponível.'}
              </p>

              {/* Crew */}
              {movie.credits?.crew && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-white mb-4">Equipe</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.credits.crew
                      .filter((person: CrewMember) =>
                        ['Director', 'Producer', 'Writer'].includes(person.job)
                      )
                      .slice(0, 6)
                      .map((person: CrewMember, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 p-4 rounded-xl"
                        >
                          <h5 className="font-semibold text-white">
                            {person.name}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {person.job}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cast' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Elenco Principal
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movie.credits?.cast
                  ?.slice(0, 8)
                  .map((actor: CastMember) => (
                    <div
                      key={actor.id}
                      className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-700/50 transition text-center"
                    >
                      {actor.profile_path ? (
                        <img
                          src={getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/96x96/0f3460/ffffff?text=?';
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                          {actor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </div>
                      )}
                      <h4 className="font-semibold text-white truncate">
                        {actor.name}
                      </h4>
                      <p className="text-gray-400 text-sm truncate">
                        {actor.character}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Detalhes Técnicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">
                        Idioma Original
                      </h4>
                      <p className="text-gray-300">
                        {movie.original_language
                          ? movie.original_language.toUpperCase()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Film className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">Status</h4>
                      <p className="text-gray-300">
                        {movie.status || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Tag className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">Orçamento</h4>
                      <p className="text-gray-300">
                        {formatCurrency(movie.budget)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">Receita</h4>
                      <p className="text-gray-300">
                        {formatCurrency(movie.revenue)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">
                        Data de Lançamento
                      </h4>
                      <p className="text-gray-300">
                        {movie.release_date || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-white">Duração</h4>
                      <p className="text-gray-300">
                        {formatRuntime(movie.runtime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-white mb-4">
                    Empresas Produtoras
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.map((company: ProductionCompany) => (
                      <div
                        key={company.id}
                        className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg"
                      >
                        {company.logo_path && (
                          <img
                            src={getImageUrl(company.logo_path, 'w92')}
                            alt={company.name}
                            className="h-8"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        <span className="text-white">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              Filmes Similares
              <ChevronRight className="ml-2" size={20} />
            </h3>

            <div className="space-y-4">
              {similarMovies.length > 0 ? (
                similarMovies.map((similarMovie) => (
                  <Link
                    key={similarMovie.id}
                    to={`/movie/${similarMovie.id}`}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-700/50 rounded-lg transition group"
                  >
                    <img
                      src={getImageUrl(similarMovie.poster_path, 'w92')}
                      alt={similarMovie.title}
                      className="w-16 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/92x138/1a1a2e/ffffff?text=No+Image';
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-purple-300 transition line-clamp-1">
                        {similarMovie.title}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                        <span>
                          {similarMovie.release_date?.substring(0, 4) || 'N/A'}
                        </span>
                        <span className="flex items-center">
                          <Star
                            className="text-yellow-400 mr-1"
                            size={12}
                            fill="currentColor"
                          />
                          {similarMovie.vote_average
                            ? similarMovie.vote_average.toFixed(1)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Nenhum filme similar encontrado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
