#!/bin/bash
# Script para adicionar nodejs como dependência ao pacote .deb após o build

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DEB_FILE=$(find "$PROJECT_ROOT/src-tauri/target/release/bundle/deb" -name "*.deb" 2>/dev/null | head -1)

if [ -z "$DEB_FILE" ]; then
    echo "❌ Arquivo .deb não encontrado!"
    exit 1
fi

echo "📦 Adicionando nodejs como dependência ao pacote .deb..."
echo "   Arquivo: $DEB_FILE"

# Criar diretório temporário
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR" || exit 1

# Extrair o pacote .deb
dpkg-deb -x "$DEB_FILE" extract
dpkg-deb -e "$DEB_FILE" extract/DEBIAN

# Modificar o arquivo control para adicionar nodejs
if [ -f extract/DEBIAN/control ]; then
    # Verificar se nodejs já está nas dependências
    if ! grep -q "nodejs" extract/DEBIAN/control; then
        # Adicionar nodejs às dependências
        sed -i '/^Depends:/ s/$/, nodejs/' extract/DEBIAN/control
        echo "✅ nodejs adicionado às dependências"
    else
        echo "ℹ️  nodejs já está nas dependências"
    fi
    
    # Reconstruir o pacote .deb
    dpkg-deb -b extract "$DEB_FILE"
    echo "✅ Pacote .deb atualizado com sucesso!"
else
    echo "❌ Arquivo control não encontrado!"
    exit 1
fi

# Limpar
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo "✅ Concluído!"

