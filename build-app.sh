#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🏗️  Construindo aplicação Loja de Roupas...${NC}"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro na instalação de dependências${NC}"
        exit 1
    fi
fi

# Build do CSS
echo -e "${YELLOW}🎨 Build do Tailwind CSS...${NC}"
npm run build:css
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build do CSS${NC}"
    exit 1
fi

# Copiar index.html
echo -e "${YELLOW}📄 Copiando index.html...${NC}"
cp src/index.html public/index.html
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao copiar index.html${NC}"
    exit 1
fi

# Build do Webpack
echo -e "${YELLOW}🔨 Build do Webpack...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build do Webpack${NC}"
    exit 1
fi

# Verificar se os arquivos foram criados
echo -e "${YELLOW}🔍 Verificando arquivos de build...${NC}"
if [ ! -f "public/bundle.js" ]; then
    echo -e "${RED}❌ bundle.js não foi gerado${NC}"
    echo "Conteúdo do diretório public:"
    ls -la public/
    exit 1
fi

if [ ! -f "public/output.css" ]; then
    echo -e "${RED}❌ output.css não foi gerado${NC}"
    exit 1
fi

if [ ! -f "public/index.html" ]; then
    echo -e "${RED}❌ index.html não foi gerado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
echo -e "${GREEN}📁 Arquivos em public/:${NC}"
ls -lh public/