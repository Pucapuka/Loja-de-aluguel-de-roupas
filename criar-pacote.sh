#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 Empacotando Loja de Roupas...${NC}"

# Nome do pacote
PACKAGE_NAME="loja-roupas"
VERSION="1.0.3"
ARCHITECTURE="all"

# Verificar dependências
if ! command -v dpkg-deb &> /dev/null; then
    echo -e "${RED}❌ dpkg-deb não encontrado. Instale com: sudo apt install dpkg-dev${NC}"
    exit 1
fi

# Criar diretório temporário
BUILD_DIR="temp-build"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR/DEBIAN
mkdir -p $BUILD_DIR/usr/local/loja-roupas
mkdir -p $BUILD_DIR/usr/share/applications
mkdir -p $BUILD_DIR/usr/share/icons/hicolor/256x256/apps

echo -e "${YELLOW}📁 Copiando arquivos...${NC}"

# Copiar arquivos da aplicação
cp -r package.json electron.js webpack.config.js backend src public $BUILD_DIR/usr/local/loja-roupas/ 2>/dev/null || true

# Verificar se arquivos essenciais existem
if [ ! -f "$BUILD_DIR/usr/local/loja-roupas/package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado${NC}"
    exit 1
fi

# Copiar scripts DEBIAN com verificações robustas
echo -e "${YELLOW}🔧 Configurando scripts DEBIAN...${NC}"

# Control file
if [ -f "debian/control" ]; then
    cp debian/control $BUILD_DIR/DEBIAN/
    echo "" >> $BUILD_DIR/DEBIAN/control  # Garantir newline
    echo -e "${GREEN}✓ debian/control copiado${NC}"
else
    echo -e "${RED}❌ debian/control não encontrado${NC}"
    exit 1
fi

# Post-install script
if [ -f "debian/postinst" ]; then
    cp debian/postinst $BUILD_DIR/DEBIAN/
    echo "" >> $BUILD_DIR/DEBIAN/postinst
    echo -e "${GREEN}✓ debian/postinst copiado${NC}"
else
    echo -e "${YELLOW}⚠️  debian/postinst não encontrado, criando...${NC}"
    cat > $BUILD_DIR/DEBIAN/postinst << 'EOF'
#!/bin/bash
echo "Configurando Loja de Roupas..."
cd /usr/local/loja-roupas
npm install --production --no-audit --no-fund
exit 0
EOF
fi

# Pre-remove script  
if [ -f "debian/prerm" ]; then
    cp debian/prerm $BUILD_DIR/DEBIAN/
    echo "" >> $BUILD_DIR/DEBIAN/prerm
    echo -e "${GREEN}✓ debian/prerm copiado${NC}"
else
    echo -e "${YELLOW}⚠️  debian/prerm não encontrado, criando...${NC}"
    cat > $BUILD_DIR/DEBIAN/prerm << 'EOF'
#!/bin/bash
echo "Preparando remoção da Loja de Roupas..."
exit 0
EOF
fi

# Verificar se scripts têm shebang
echo -e "${YELLOW}🔍 Verificando scripts...${NC}"

for script in postinst prerm; do
    if [ -f "$BUILD_DIR/DEBIAN/$script" ]; then
        if ! head -1 "$BUILD_DIR/DEBIAN/$script" | grep -q "#!/bin/bash"; then
            echo -e "${YELLOW}⚠️  Adicionando shebang ao $script${NC}"
            sed -i '1i#!/bin/bash' "$BUILD_DIR/DEBIAN/$script"
        fi
    fi
done

# Copiar .desktop file
if [ -f "usr/share/applications/loja-roupas.desktop" ]; then
    cp usr/share/applications/loja-roupas.desktop $BUILD_DIR/usr/share/applications/
    echo -e "${GREEN}✓ .desktop file copiado${NC}"
else
    echo -e "${YELLOW}⚠️  .desktop não encontrado, criando...${NC}"
    cat > $BUILD_DIR/usr/share/applications/loja-roupas.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Loja de Roupas
Comment=Sistema de aluguel de roupas
Exec=/usr/local/loja-roupas/iniciar-loja.sh
Icon=system-run
Terminal=true
Categories=Office;
EOF
fi

# Copiar script de execução
if [ -f "usr/local/loja-roupas/iniciar-loja.sh" ]; then
    cp usr/local/loja-roupas/iniciar-loja.sh $BUILD_DIR/usr/local/loja-roupas/
    echo -e "${GREEN}✓ iniciar-loja.sh copiado${NC}"
else
    echo -e "${YELLOW}⚠️  iniciar-loja.sh não encontrado, criando...${NC}"
    cat > $BUILD_DIR/usr/local/loja-roupas/iniciar-loja.sh << 'EOF'
#!/bin/bash
cd /usr/local/loja-roupas
npm start
EOF
fi

# Configurar permissões com feedback
echo -e "${YELLOW}🔒 Configurando permissões...${NC}"
chmod 755 $BUILD_DIR/DEBIAN/postinst && echo -e "${GREEN}✓ postinst com permissões setadas${NC}"
chmod 755 $BUILD_DIR/DEBIAN/prerm && echo -e "${GREEN}✓ prerm com permissões setadas${NC}"
chmod 755 $BUILD_DIR/usr/local/loja-roupas/iniciar-loja.sh && echo -e "${GREEN}✓ iniciar-loja.sh com permissões setadas${NC}"

# Calcular tamanho instalado
INSTALLED_SIZE=$(du -sk $BUILD_DIR | cut -f1)
sed -i "s/Installed-Size: 10240/Installed-Size: $INSTALLED_SIZE/" $BUILD_DIR/DEBIAN/control

echo -e "${YELLOW}🏗️  Criando pacote .deb...${NC}"

# Criar pacote
dpkg-deb --build $BUILD_DIR "${PACKAGE_NAME}_${VERSION}_${ARCHITECTURE}.deb"

# Verificar integridade do pacote
echo -e "${YELLOW}🔍 Verificando integridade do pacote...${NC}"
if dpkg -c "${PACKAGE_NAME}_${VERSION}_${ARCHITECTURE}.deb" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Pacote criado com sucesso${NC}"
else
    echo -e "${RED}❌ Erro na integridade do pacote${NC}"
    exit 1
fi

# Verificar se foi criado com sucesso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pacote criado: ${PACKAGE_NAME}_${VERSION}_${ARCHITECTURE}.deb${NC}"
    
    # Exibir informações do pacote
    echo -e "\n${YELLOW}📋 Informações do pacote:${NC}"
    dpkg -I "${PACKAGE_NAME}_${VERSION}_${ARCHITECTURE}.deb"
    
    # Verificar tamanho
    echo -e "\n${YELLOW}📊 Tamanho do pacote:${NC}"
    ls -lh "${PACKAGE_NAME}_${VERSION}_${ARCHITECTURE}.deb"
    
    # Instruções de instalação
    echo -e "\n${YELLOW}🚀 Para instalar:${NC}"
    echo -e "sudo dpkg -i ${PACKAGE_NAME}_${VERSION}_${ARCHITECTURE}.deb"
    echo -e "\n${YELLOW}🔄 Se houver dependências faltando:${NC}"
    echo -e "sudo apt install -f"
    
else
    echo -e "${RED}❌ Erro ao criar pacote${NC}"
    exit 1
fi

# Limpar
rm -rf $BUILD_DIR

echo -e "\n${GREEN}🎉 Empacotamento concluído!${NC}"