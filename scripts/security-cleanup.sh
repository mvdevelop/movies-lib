#!/bin/bash
#
# 🔐 Script de Remoção de Credencial Exposta
# ====================
# Este script remove a API Key da TMDB do histórico Git e prepara o projeto
# para uso seguro. Execute após revogar a chave antiga na TMDB.
#
# ⚠️ IMPORTANTE: Execute em uma máquina local com acesso ao repositório Git.
#    Este script NÃO deve ser commitado ao repositório por questões de segurança.
#
# Passos manuais antes de rodar este script:
# 1. Acesse https://www.themoviedb.org/settings/api
# 2. Revogue a API Key antiga: fcba9bbe02b8e4ea7abf19f825c13c9a
# 3. Gere uma nova API Key
# 4. Atualize o .env local com a nova chave
# 5. Rode este script para limpar o histórico Git
#

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Security Cleanup Script ===${NC}"
echo ""

# Check if repo is clean
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ O repositório está com mudanças não commitadas. Commit ou stash antes de continuar.${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Este script irá REescrever o histórico Git, removendo a API Key exposta.${NC}"
echo -e "${YELLOW}⚠️  Isso pode causar conflitos se outros colaboradores já clonaram o repositório.${NC}"
echo ""
read -p "Deseja continuar? (digite 'yes' para confirmar): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Operação cancelada."
    exit 0
fi

# Step 1: Install git-filter-repo if not present
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando git-filter-repo...${NC}"
    pip3 install git-filter-repo
fi

# Step 2: Remove .env from all history
echo -e "${YELLOW}🧹 Removendo .env do histórico Git...${NC}"
git filter-repo --path .env --invert-paths

# Step 3: Also remove the API key string from all files in history
echo -e "${YELLOW}🧹 Removendo API Key (fcba9bbe02b8e4ea7abf19f825c13c9a) do histórico Git...${NC}"
git filter-repo --replace-text <(echo "fcba9bbe02b8e4ea7abf19f825c13c9a==>REDACTED_API_KEY")

# Step 4: Force push to origin (requires --force-with-lease)
echo -e "${YELLOW}⬆️  Fazendo force push para o repositório remoto...${NC}"
echo -e "${RED}⚠️  Você precisará forçar o push manualmente:${NC}"
echo "    git push origin --force-with-lease"
echo ""

# Step 5: Instructions for teammates
echo -e "${GREEN}✅ Limpeza concluída!${NC}"
echo ""
echo "=== Próximos passos ==="
echo "1. Revogue a chave antiga na TMDB: https://www.themoviedb.org/settings/api"
echo "2. Gere uma nova API Key"
echo "3. Adicione a nova chave ao seu .env local (já no .gitignore)"
echo "4. Force push: git push origin --force-with-lease"
echo "5. Seus colegas devem: git fetch && git reset --hard origin/main"
echo "6. Configure um backend proxy para não expor a chave (server-side)"
echo ""
echo -e "${GREEN}=== Segurança concluída! ===${NC}"
