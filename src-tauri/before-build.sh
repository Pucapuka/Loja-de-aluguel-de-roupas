#!/bin/bash
# Script executado antes do build do Tauri

cd "$(dirname "$0")/.." || exit 1

echo "📦 Construindo frontend..."
npm run build:web || exit 1

echo "📦 Instalando dependências do backend..."
cd backend || exit 1
npm install --production || exit 1

echo "✅ Pré-build concluído com sucesso!"
