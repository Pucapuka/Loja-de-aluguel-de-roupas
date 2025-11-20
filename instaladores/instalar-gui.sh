#!/bin/bash

# Verificar se zenity está instalado
if ! command -v zenity &> /dev/null; then
    echo "Instalando zenity..."
    sudo apt update && sudo apt install -y zenity
fi

# Dialogo de boas-vindas
zenity --info \
  --title="Instalador Loja de Roupas" \
  --text="Bem-vindo ao instalador da Loja de Aluguel de Roupas!\n\nEste instalador vai:\n• Instalar Node.js se necessário\n• Baixar a aplicação\n• Criar um atalho na área de trabalho" \
  --width=400

# Confirmar instalação
if zenity --question \
  --title="Confirmação de Instalação" \
  --text="Deseja instalar a Loja de Roupas em seu computador?" \
  --width=300; then
    
    # Mostrar barra de progresso
    (
        echo "10" ; sleep 1
        echo "# Verificando dependências..." 
        
        # Instalar Node.js se necessário
        if ! command -v node &> /dev/null; then
            echo "25" ; echo "# Instalando Node.js..." 
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        echo "50" ; echo "# Configurando aplicação..."
        
        # Executar o install.sh existente
        chmod +x install.sh
        ./install.sh
        
        echo "90" ; echo "# Finalizando instalação..." ; sleep 1
        echo "100" ; echo "# Instalação concluída!" ; sleep 1
    ) | zenity --progress \
      --title="Instalando Loja de Roupas" \
      --text="Preparando instalação..." \
      --percentage=0 \
      --auto-close \
      --width=300
    
    if [ $? -eq 0 ]; then
        zenity --info \
          --title="Instalação Concluída" \
          --text="✅ Instalação concluída com sucesso!\n\n📁 Banco de dados: ~/.loja-roupas/loja.db\n🚀 Atalho criado na área de trabalho\n\nClique em 'Loja de Roupas' para executar!" \
          --width=400
    else
        zenity --error \
          --title="Erro na Instalação" \
          --text="Ocorreu um erro durante a instalação." \
          --width=300
    fi
else
    zenity --info \
      --title="Instalação Cancelada" \
      --text="Instalação cancelada pelo usuário." \
      --width=250
fi