#!/bin/bash
# ============================================
# DESINSTALADOR CLICÁVEL - LOJA DE ALUGUEL DE ROUPAS
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função Zenity
show_dialog() {
    if command -v zenity &> /dev/null; then
        zenity --info --title="$1" --text="$2" --width=400
    else
        echo -e "${BLUE}$1${NC}"
        echo "$2"
        echo ""
    fi
}

ask_yesno() {
    if command -v zenity &> /dev/null; then
        zenity --question --title="$1" --text="$2" --width=400
        return $?
    else
        echo -e "${YELLOW}$2 (s/N)${NC}"
        read -p "> " resposta
        [[ "$resposta" =~ ^[Ss]$ ]]
        return $?
    fi
}

# ========== INÍCIO ==========

clear
echo -e "${RED}"
echo "╔══════════════════════════════════════════════════╗"
echo "║      🗑️ DESINSTALADOR - LOJA DE ROUPAS 🗑️       ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

show_dialog "Aviso Importante" "Esta ação vai REMOVER COMPLETAMENTE a Loja de Aluguel de Roupas do seu computador.\n\nIsso inclui:\n• A aplicação\n• Todos os dados cadastrados\n• Configurações\n\nCertifique-se de ter feito backup dos dados importantes!"

if ! ask_yesno "Confirmação" "⚠️  TEM CERTEZA que deseja remover tudo?\n\nEsta ação NÃO pode ser desfeita!"; then
    show_dialog "Cancelado" "A desinstalação foi cancelada.\nSeus dados estão preservados.")
    exit 0
fi

# Confirmação EXTRA
if ! ask_yesno "Última Chance" "❗️ ÚLTIMA CONFIRMAÇÃO:\n\nVocê realmente quer APAGAR TODOS os dados da loja?\n\nDigite 'SIM' para confirmar:"; then
    show_dialog "Cancelado" "Desinstalação cancelada na última confirmação.")
    exit 0
fi

echo -e "${YELLOW}Iniciando desinstalação...${NC}"

# 1. Parar aplicação
echo -e "${BLUE}[1/5]${NC} Parando aplicação..."
cd "$HOME/LojaDeRoupas" 2>/dev/null && docker-compose down 2>/dev/null
docker stop loja-de-roupas 2>/dev/null
docker rm loja-de-roupas 2>/dev/null

# 2. Remover imagem Docker
echo -e "${BLUE}[2/5]${NC} Removendo imagem Docker..."
docker rmi loja-roupas:final 2>/dev/null

# 3. Remover pasta da aplicação
echo -e "${BLUE}[3/5]${NC} Removendo arquivos..."
rm -rf "$HOME/LojaDeRoupas" 2>/dev/null

# 4. Remover atalhos
echo -e "${BLUE}[4/5]${NC} Removendo atalhos..."
rm -f "$HOME/Área de Trabalho/Abrir Loja.desktop" 2>/dev/null
rm -f "$HOME/Desktop/Abrir Loja.desktop" 2>/dev/null
rm -f "$HOME/Área de Trabalho/Gerenciar Loja.desktop" 2>/dev/null
rm -f "$HOME/Desktop/Gerenciar Loja.desktop" 2>/dev/null

# 5. Limpar volumes não usados (opcional)
echo -e "${BLUE}[5/5]${NC} Limpando resíduos..."
docker system prune -f 2>/dev/null

show_dialog "✅ Desinstalação Completa" "A Loja de Aluguel de Roupas foi completamente removida do seu sistema.\n\nTodos os dados foram apagados.\n\nSe quiser reinstalar, execute o instalador novamente.")

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════╗"
echo "║        ✅ DESINSTALAÇÃO CONCLUÍDA! ✅            ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"
