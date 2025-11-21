#!/bin/bash
cd /usr/local/loja-roupas

# Limpar variáveis problemáticas
unset NODE_OPTIONS

# Matar processos antigos
pkill -f "node.*server.js" || true
pkill -f "electron" || true
sleep 2

echo "Iniciando Loja de Roupas..."
npm start