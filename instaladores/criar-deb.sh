#!/bin/bash

echo "Criando pacote .deb..."

# Criar estrutura temporária
mkdir -p deb-package/DEBIAN
mkdir -p deb-package/usr/local/loja-roupas
mkdir -p deb-package/usr/share/applications

# Copiar arquivos do projeto
cp -r * deb-package/usr/local/loja-roupas/

# Criar arquivo control
cat > deb-package/DEBIAN/control << EOF
Package: loja-roupas
Version: 1.0.0
Section: office
Priority: optional
Architecture: all
Depends: nodejs, npm
Maintainer: Loja de Roupas <contato@lojaroupas.com>
Description: Sistema de aluguel de roupas
 Sistema completo para gerenciamento de aluguel de roupas.
EOF

# Criar script de pós-instalação
cat > deb-package/DEBIAN/postinst << 'EOF'
#!/bin/bash
# Instalar dependências
cd /usr/local/loja-roupas
npm install --production

# Criar diretório de dados para o usuário atual
mkdir -p /home/$SUDO_USER/.loja-roupas
chown $SUDO_USER:$SUDO_USER /home/$SUDO_USER/.loja-roupas

# Atualizar ícones
update-desktop-database
EOF

chmod +x deb-package/DEBIAN/postinst

# Criar .desktop file
cat > deb-package/usr/share/applications/loja-roupas.desktop << EOF
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

# Criar pacote .deb
dpkg-deb --build deb-package loja-roupas.deb

echo "✅ Pacote criado: loja-roupas.deb"
echo "📦 Para instalar: sudo dpkg -i loja-roupas.deb"

# Limpar
rm -rf deb-package