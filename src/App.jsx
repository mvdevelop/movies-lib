
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
          
          {/* ADICIONE ESTAS ROTAS PARA EVITAR WARNINGS */}
          <Route path="/movies-library" element={<Home />} />
          <Route path="/Movies_Library" element={<Home />} />
          <Route path="/tv-shows" element={<Home />} />
          <Route path="/my-list" element={<Home />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2024 Movie Library. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Dados fornecidos por TMDB</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="hover:text-white transition">Termos de Uso</a>
            <a href="#" className="hover:text-white transition">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;
