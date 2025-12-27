
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, Filter, X, Sliders, TrendingUp, Clock } from 'lucide-react';

const Search = () => {
  const { query } = useParams()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState(query || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'relevance'
  })

  // Dados de exemplo para busca
  const sampleMovies = [
    {
      id: 1,
      title: 'Duna',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300',
      rating: 8.0,
      year: 2021,
      duration: '2h 35m',
      genre: ['Ficção Científica', 'Aventura'],
      description: 'Paul Atreides se une a Chani e aos Fremen em sua guerra de vingança.'
    },
    {
      id: 2,
      title: 'Duna: Parte Dois',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=301',
      rating: 8.7,
      year: 2024,
      duration: '2h 46m',
      genre: ['Ficção Científica', 'Aventura'],
      description: 'Continuação da épica jornada de Paul Atreides.'
    },
    {
      id: 3,
      title: 'Interestelar',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=302',
      rating: 8.6,
      year: 2014,
      duration: '2h 49m',
      genre: ['Aventura', 'Drama', 'Ficção Científica'],
      description: 'Uma equipe de exploradores viaja através de um buraco de minhoca.'
    },
    {
      id: 4,
      title: 'Blade Runner 2049',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=303',
      rating: 8.0,
      year: 2017,
      duration: '2h 44m',
      genre: ['Ficção Científica', 'Drama'],
      description: 'Um novo blade runner descobre um segredo há muito enterrado.'
    },
    {
      id: 5,
      title: 'Arrival',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=304',
      rating: 7.9,
      year: 2016,
      duration: '1h 56m',
      genre: ['Drama', 'Ficção Científica'],
      description: 'Um linguista trabalha com o exército para comunicar com alienígenas.'
    },
    {
      id: 6,
      title: 'O Exterminador do Futuro 2',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=305',
      rating: 8.6,
      year: 1991,
      duration: '2h 17m',
      genre: ['Ação', 'Ficção Científica'],
      description: 'Um ciborgue é enviado do futuro para proteger um jovem.'
    }
  ]

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [query, location])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    
    // Simular busca
    setTimeout(() => {
      const filtered = sampleMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      // Aplicar filtros
      let finalResults = [...filtered]
      
      if (filters.genre) {
        finalResults = finalResults.filter(movie => 
          movie.genre.includes(filters.genre)
        )
      }
      
      if (filters.year) {
        finalResults = finalResults.filter(movie => 
          movie.year.toString() === filters.year
        )
      }
      
      if (filters.rating) {
        finalResults = finalResults.filter(movie => 
          movie.rating >= parseFloat(filters.rating)
        )
      }
      
      // Ordenar resultados
      if (filters.sortBy === 'year') {
        finalResults.sort((a, b) => b.year - a.year)
      } else if (filters.sortBy === 'rating') {
        finalResults.sort((a, b) => b.rating - a.rating)
      } else if (filters.sortBy === 'title') {
        finalResults.sort((a, b) => a.title.localeCompare(b.title))
      }
      
      setResults(finalResults)
      setLoading(false)
    }, 600)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sortBy: 'relevance'
    })
    handleSearch()
  }

  return (
    <div className="fade-in">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {query ? `Resultados para: "${query}"` : 'Buscar Filmes'}
        </h1>
        <p className="text-gray-400">
          {results.length > 0 
            ? `${results.length} resultados encontrados` 
            : 'Digite para buscar filmes, séries e mais'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="relative max-w-2xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar filmes, séries, gêneros..."
            className="w-full px-6 py-4 pl-14 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
          />
          <SearchIcon className="absolute left-5 top-4 text-gray-400" size={24} />
          <button
            type="submit"
            className="absolute right-3 top-3 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 transition font-medium"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <Sliders size={20} />
            <span>Filtros</span>
            {Object.values(filters).some(f => f) && (
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            )}
          </button>
          
          <div className="flex flex-wrap gap-2">
            {filters.genre && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                Gênero: {filters.genre}
                <button onClick={() => setFilters({...filters, genre: ''})} className="ml-2">
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                Ano: {filters.year}
                <button onClick={() => setFilters({...filters, year: ''})} className="ml-2">
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                Rating: {filters.rating}+
                <button onClick={() => setFilters({...filters, rating: ''})} className="ml-2">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Ordenar por:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => {
              setFilters({...filters, sortBy: e.target.value})
              handleSearch()
            }}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="relevance">Relevância</option>
            <option value="year">Ano (Mais Recente)</option>
            <option value="rating">Avaliação</option>
            <option value="title">Título (A-Z)</option>
          </select>
          
          {(filters.genre || filters.year || filters.rating) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Gênero</label>
              <div className="space-y-2">
                {['Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 'Romance'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setFilters({...filters, genre: filters.genre === genre ? '' : genre})}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                      filters.genre === genre 
                        ? 'bg-purple-900 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Ano</label>
              <div className="space-y-2">
                {['2024', '2023', '2022', '2021', '2020', '2019'].map((year) => (
                  <button
                    key={year}
                    onClick={() => setFilters({...filters, year: filters.year === year ? '' : year})}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                      filters.year === year 
                        ? 'bg-purple-900 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-3 font-medium">Avaliação Mínima</label>
              <div className="space-y-2">
                {['9.0', '8.0', '7.0', '6.0'].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilters({...filters, rating: filters.rating === rating ? '' : rating})}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                      filters.rating === rating 
                        ? 'bg-purple-900 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {rating}+
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 flex justify-end">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition font-medium"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Buscando resultados...</p>
          </div>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <button className="px-4 py-2 bg-purple-900 rounded-lg">1</button>
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">2</button>
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">3</button>
              <span className="px-2 text-gray-400">...</span>
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">10</button>
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                Próxima
              </button>
            </div>
          </div>
        </>
      ) : searchTerm ? (
        <div className="text-center py-20">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Nenhum resultado encontrado</h3>
          <p className="text-gray-400 mb-6">Tente buscar por outras palavras-chave ou ajustar os filtros</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition"
          >
            Limpar Busca
          </button>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">O que você está procurando?</h3>
            <p className="text-gray-400 mb-8">
              Busque por títulos, gêneros, atores ou diretores. Use filtros para refinar sua busca.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <TrendingUp className="text-purple-400 mb-2" />
                <h4 className="font-semibold text-white">Em Alta</h4>
                <p className="text-sm text-gray-400">Veja o que está popular</p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <Clock className="text-purple-400 mb-2" />
                <h4 className="font-semibold text-white">Recentes</h4>
                <p className="text-sm text-gray-400">Lançamentos recentes</p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <Filter className="text-purple-400 mb-2" />
                <h4 className="font-semibold text-white">Filtros</h4>
                <p className="text-sm text-gray-400">Refine sua busca</p>
              </div>
            </div>
            
            <div className="text-gray-500">
              <p className="mb-2">Sugestões: "ação", "comédia", "Christopher Nolan", "2024"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search;
