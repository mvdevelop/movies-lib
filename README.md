
🎬 Movies Library

Uma aplicação web de biblioteca de filmes desenvolvida com React, Vite e Tailwind CSS. O projeto consome dados de filmes, organiza listagens e permite navegação entre páginas utilizando React Router v6.

🚀 Tecnologias Utilizadas

⚛️ React — biblioteca para construção da interface

⚡ Vite — bundler rápido para desenvolvimento e build

🎨 Tailwind CSS — estilização utilitária e responsiva

🧭 React Router DOM (v6) — gerenciamento de rotas

📦 JavaScript (ES6+)

📂 Estrutura do Projeto
src/
 ├─ components/      # Componentes reutilizáveis (Navbar, etc.)
 ├─ pages/           # Páginas da aplicação
 │   ├─ Home.jsx
 │   ├─ MoviesLibrary.jsx
 │   ├─ MovieDetails.jsx
 │   └─ NotFound.jsx
 ├─ App.jsx          # Layout principal com Navbar e <Outlet />
 ├─ main.jsx         # Configuração de rotas e bootstrap do app
 └─ index.css        # Estilos globais (Tailwind)
🧩 Funcionalidades

📚 Listagem de filmes

🔍 Navegação entre páginas

🎥 Página de detalhes do filme

🚫 Página 404 para rotas inexistentes

📱 Layout responsivo

🛣️ Rotas da Aplicação
Rota	Descrição
/	Página inicial
/movies-library	Biblioteca de filmes
/movies/:id	Detalhes de um filme
*	Página não encontrada
▶️ Como Rodar o Projeto Localmente
1️⃣ Clone o repositório
git clone https://github.com/seu-usuario/movies-library.git
2️⃣ Acesse a pasta do projeto
cd movies-library
3️⃣ Instale as dependências
npm install
4️⃣ Rode o servidor de desenvolvimento
npm run dev

A aplicação estará disponível em:

http://localhost:5173
🏗️ Build para Produção
npm run build

Os arquivos finais serão gerados na pasta dist/.

📌 Boas Práticas Adotadas

Separação de layout e rotas usando <Outlet />

URLs amigáveis (kebab-case)

Componentização

Padronização de nomes (PascalCase para componentes)

📈 Próximas Melhorias (Ideias)

🔎 Busca de filmes

⭐ Favoritos

🌙 Modo escuro

🎞️ Integração com API externa (TMDB)

🔐 Autenticação de usuários

👨‍💻 Autor

Desenvolvido por mvdevelop 💻

📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, estudar e modificar.
