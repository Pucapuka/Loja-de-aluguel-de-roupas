#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Instalador Loja de Aluguel de Roupas ===${NC}"

# Verificar e instalar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado. Instalando...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js instalado${NC}"
fi

# Criar diretório de dados do usuário
echo -e "${YELLOW}Configurando diretório de dados...${NC}"
USER_DATA_DIR="$HOME/.loja-roupas"
mkdir -p "$USER_DATA_DIR"
chmod 755 "$USER_DATA_DIR"
echo -e "${GREEN}✓ Diretório de dados: $USER_DATA_DIR${NC}"

# Instalar dependências do projeto
echo -e "${YELLOW}Instalando dependências...${NC}"
npm install

# Criar script de execução
echo -e "${YELLOW}Criando script de execução...${NC}"
cat > iniciar-loja.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================="
echo "  Loja de Aluguel de Roupas"
echo "=========================================="
echo "📁 Banco de dados: $HOME/.loja-roupas/loja.db"
echo "🚀 Iniciando aplicação..."
echo ""

# Executar o start definido no package.json
npm start
EOF

chmod +x iniciar-loja.sh

# Criar atalho no desktop
echo -e "${YELLOW}Criando atalho na área de trabalho...${NC}"
cat > ~/Desktop/Loja-de-Roupas.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Loja de Roupas
Comment=Sistema de aluguel de roupas
Exec=$PWD/iniciar-loja.sh
Icon=system-run
Terminal=true
Categories=Office;
EOF

chmod +x ~/Desktop/Loja-de-Roupas.desktop

echo -e "${GREEN}✅ Instalação concluída!${NC}"
echo -e "${GREEN}📊 Banco de dados: $USER_DATA_DIR/loja.db${NC}"
echo -e "${GREEN}🚀 Atalho criado na Área de Trabalho${NC}"
echo -e "${YELLOW}💡 Para executar: clique no ícone 'Loja de Roupas' na área de trabalho${NC}"