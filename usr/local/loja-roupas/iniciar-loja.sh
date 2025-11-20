#!/bin/bash
cd /usr/local/loja-roupas

# Limpar processos
pkill -f "node.*server.js" || true
pkill -f "electron" || true
sleep 3

# Configurar
unset NODE_OPTIONS
export ELECTRON_DISABLE_SANDBOX=1

mkdir -p "$HOME/.loja-roupas"
echo "Iniciando Loja de Roupas..."

npm start