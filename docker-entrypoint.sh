#!/bin/sh
set -e

# Ajustar permissões do diretório de dados COMO ROOT
# Se a variável DB_PATH estiver definida, ajusta o diretório pai
if [ -n "$DB_PATH" ]; then
    DATA_DIR=$(dirname "$DB_PATH")
    echo "Entrypoint: Ajustando permissões para: $DATA_DIR"
    mkdir -p "$DATA_DIR"
    chown -R nodejs:nodejs "$DATA_DIR"
    chmod -R 755 "$DATA_DIR"
else
    echo "Entrypoint: Variável DB_PATH não definida. Pulando ajuste de permissões."
fi

# TROCAR para o usuário não-root (nodejs) para executar a aplicação
echo "Entrypoint: Iniciando aplicação como usuário 'nodejs'."
exec su-exec nodejs "$@"
