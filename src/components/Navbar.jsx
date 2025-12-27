
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Home, Film, User } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { name: 'Início', path: '/', icon: <Home size={20} /> },
    { name: 'Filmes', path: '/movies-library', icon: <Film size={20} /> },
    { name: 'Séries', path: '/tv-shows', icon: <Film size={20} /> },
    { name: 'Minha Lista', path: '/my-list', icon: <User size={20} /> },
  ]

  return (
    <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Film className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MovieLib
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar Desktop */}
          <div className="hidden md:block w-96">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar filmes, séries..."
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:opacity-90 transition"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              
              {/* Search Bar Mobile */}
              <form onSubmit={handleSearch} className="pt-4 border-t border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:opacity-90 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;
