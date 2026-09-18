#!/bin/bash
#
# 🔍 Pre-commit Hook: Prevent committing .env files with real secrets
# ================================================================
# This hook checks if any .env file (except .env.example and .env.*.example)
# contains a real API key or secret and blocks the commit if found.
#

# Get staged files matching .env pattern (but not .example files)
STAGED_ENV=$(git diff --cached --name-only --diff-filter=A -- '*env*' | grep -v '\.example$' || true)

if [ -z "$STAGED_ENV" ]; then
    exit 0
fi

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BLOCK=false

for file in $STAGED_ENV; do
    if [ -f "$file" ]; then
        # Check if file contains a real value (not placeholder)
        if grep -qE '^[A-Z_]+=(?!your_|<|your_|REDACTED)' "$file" 2>/dev/null; then
            echo -e "${RED}❌ ERRO: O arquivo $file parece conter segredos reais.${NC}"
            echo -e "${YELLOW}⚠️  Arquivos .env com chaves reais NÃO devem ser commitados.${NC}"
            echo "  Remova o arquivo do stage: git reset HEAD $file"
            BLOCK=true
        fi
    fi
done

if [ "$BLOCK" = true ]; then
    echo ""
    echo -e "${RED}Commit bloqueado por motivos de segurança.${NC}"
    exit 1
fi

exit 0
