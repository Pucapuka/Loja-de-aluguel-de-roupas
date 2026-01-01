#!/bin/bash
echo "🛍️  INSTALANDO LOJA DE ROUPAS v1.6"
echo "=============================="
echo ""

# 1. DOCKER
if ! command -v docker &> /dev/null; then
    echo "Instalando Docker..."
    sudo apt update
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado"
    echo "⚠️  FAÇA LOGOUT E LOGIN!"
fi

# 2. CRIAR PASTA DATA (o entrypoint ajustará as permissões)
mkdir -p data

# 3. BAIXAR E RODAR IMAGEM
echo "Baixando e iniciando loja de roupas..."
sudo docker-compose up -d

echo ""
echo "✅ PRONTO!"
echo "Acesse: http://localhost:5000"
echo ""
echo "⏰ Aguarde 30 segundos para inicialização completa..."
echo "📁 Seus dados serão salvos em: $(pwd)/data"
