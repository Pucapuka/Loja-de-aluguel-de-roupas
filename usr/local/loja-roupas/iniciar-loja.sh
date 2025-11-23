#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================="
echo "  Loja de Aluguel de Roupas"
echo "=========================================="
echo "📁 Banco de dados: $HOME/.loja-roupas/loja.db"
echo "🚀 Iniciando aplicação..."
echo ""

# Verificar se há processo do backend antigo
pkill -f "node.*backend/server.js" 2>/dev/null || true

# Executar o start definido no package.json
npm start