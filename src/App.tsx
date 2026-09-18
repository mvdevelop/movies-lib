import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Search from './pages/Search';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:query" element={<Search />} />

          {/* Rotas de fallback para compatibilidade histórica */}
          <Route path="/movies-library" element={<Home />} />
          <Route path="/Movies_Library" element={<Home />} />
          <Route path="/tv-shows" element={<Home />} />
          <Route path="/my-list" element={<Home />} />

          {/* Página 404 */}
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-white mb-4">404</h2>
                <p className="text-gray-400 mb-6">Página não encontrada.</p>
                <a
                  href="/"
                  className="text-purple-400 hover:text-purple-300 transition"
                >
                  Voltar para a página inicial
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Movie Library. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Dados fornecidos por TMDB</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="#"
              className="hover:text-white transition"
              onClick={(e) => e.preventDefault()}
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="hover:text-white transition"
              onClick={(e) => e.preventDefault()}
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="hover:text-white transition"
              onClick={(e) => e.preventDefault()}
            >
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
