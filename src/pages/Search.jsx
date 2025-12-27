
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { tmdbApi } from '../services/api';
import { Search as SearchIcon, Filter, X, Sliders, TrendingUp, Clock, Loader } from 'lucide-react';

const Search = () => {
  const { query } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState(query || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  })

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [query, location, currentPage])

  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    
    try {
      const params = {
        query: searchTerm,
        page,
        ...filters
      }

      const response = await tmdbApi.searchMovies(searchTerm, page)
      const data = response.data
      
      setResults(data.results)
      setTotalResults(data.total_results)
      setTotalPages(data.total_pages)
      setCurrentPage(data.page)
      
    } catch (error) {
      console.error('Erro na busca:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`)
    }
  }

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sortBy: 'popularity.desc'
    })
    setCurrentPage(1)
    handleSearch(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const years = Array.from({length: 20}, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="fade-in">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {query ? `Resultados para: "${decodeURIComponent(query)}"` : 'Buscar Filmes'}
        </h1>
        <p className="text-gray-400">
          {totalResults > 0 
            ? `${totalResults.toLocaleString()} resultados encontrados` 
            : 'Digite para buscar filmes'}
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
      {query && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              <Sliders size={20} />
              <span>Filtros</span>
            </button>
            
            <div className="text-sm text-gray-400">
              Página {currentPage} de {totalPages}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Ordenar por:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters({...filters, sortBy: e.target.value})
                handleSearch(1)
              }}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="popularity.desc">Popularidade</option>
              <option value="release_date.desc">Data (Mais Recente)</option>
              <option value="release_date.asc">Data (Mais Antigo)</option>
              <option value="vote_average.desc">Avaliação</option>
              <option value="original_title.asc">Título (A-Z)</option>
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
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader className="animate-spin text-purple-500 mx-auto mb-4" size={48} />
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
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === pageNum
                          ? 'bg-purple-900 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      ) : searchTerm && !loading ? (
        <div className="text-center py-20">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Nenhum resultado encontrado</h3>
          <p className="text-gray-400 mb-6">Tente buscar por outras palavras-chave</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setResults([])
              navigate('/search')
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition"
          >
            Nova Busca
          </button>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">O que você está procurando?</h3>
            <p className="text-gray-400 mb-8">
              Busque por títulos, atores ou diretores
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <TrendingUp className="text-purple-400 mb-3" size={32} />
                <h4 className="font-semibold text-white mb-2">Sugestões Populares</h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Ação', 'Comédia', '2024', 'Marvel', 'Animação'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchTerm(term)
                        navigate(`/search/${encodeURIComponent(term)}`)
                      }}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <Clock className="text-purple-400 mb-3" size={32} />
                <h4 className="font-semibold text-white mb-2">Filmes Recentes</h4>
                <div className="text-left mt-3 space-y-2">
                  {['2024', '2023', '2022'].map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSearchTerm(year)
                        navigate(`/search/${encodeURIComponent(year)}`)
                      }}
                      className="block w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                      Lançamentos {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search;
