
import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { Play, TrendingUp, Filter, Sparkles } from 'lucide-react';

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados de exemplo
  const sampleMovies = [
    {
      id: 1,
      title: 'Duna: Parte Dois',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300',
      rating: 8.7,
      year: 2024,
      duration: '2h 46m',
      genre: ['Ficção Científica', 'Aventura'],
      description: 'Paul Atreides se une a Chani e aos Fremen em sua guerra de vingança contra os conspiradores que destruíram sua família.'
    },
    {
      id: 2,
      title: 'Oppenheimer',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w-301',
      rating: 8.3,
      year: 2023,
      duration: '3h',
      genre: ['Biografia', 'Drama'],
      description: 'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.'
    },
    {
      id: 3,
      title: 'Interestelar',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w-302',
      rating: 8.6,
      year: 2014,
      duration: '2h 49m',
      genre: ['Aventura', 'Drama'],
      description: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na esperança de garantir a sobrevivência da humanidade.'
    },
    {
      id: 4,
      title: 'O Poderoso Chefão',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w-303',
      rating: 9.2,
      year: 1972,
      duration: '2h 55m',
      genre: ['Crime', 'Drama'],
      description: 'O envelhecido patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.'
    },
    {
      id: 5,
      title: 'Parasita',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w-304',
      rating: 8.6,
      year: 2019,
      duration: '2h 12m',
      genre: ['Comédia', 'Drama'],
      description: 'Uma família pobre se infiltra na casa de uma família rica, dando início a uma sequência imprevisível de eventos.'
    },
    {
      id: 6,
      title: 'Clube da Luta',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w-305',
      rating: 8.8,
      year: 1999,
      duration: '2h 19m',
      genre: ['Drama'],
      description: 'Um homem deprimido que sofre de insônia conhece um vendedor de sabonetes um tanto excêntrico.'
    }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setFeaturedMovie(sampleMovies[0])
      setMovies(sampleMovies)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Hero Section - Featured Movie */}
      <section className="relative rounded-2xl overflow-hidden mb-12">
        <div 
          className="h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${featuredMovie.poster})`
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
                    <span className="text-2xl font-bold text-purple-400">{featuredMovie.rating}</span>
                    <span className="text-gray-300">/10</span>
                  </span>
                  <span className="text-gray-300">{featuredMovie.year} • {featuredMovie.duration}</span>
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {featuredMovie.genre[0]}
                  </span>
                </div>
                
                <p className="text-gray-300 text-lg mb-8">
                  {featuredMovie.description}
                </p>
                
                <div className="flex space-x-4">
                  <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center space-x-2 hover:opacity-90 transition">
                    <Play size={24} />
                    <span className="font-semibold">Assistir Agora</span>
                  </button>
                  <button className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
                    Mais Informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-purple-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Em Alta Agora</h2>
          </div>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition">
            <Filter size={20} />
            <span>Filtrar</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Explore por Gênero</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 'Romance', 'Documentário', 'Animação', 'Fantasia', 'Crime', 'Mistério', 'Musical'].map((genre) => (
            <button
              key={genre}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 hover:transform hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <span className="text-white font-medium">{genre}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home;
