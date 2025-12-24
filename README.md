# 👗 Loja de Aluguel de Roupas — Aplicativo Desktop

Aplicativo desktop para gestão de uma loja de aluguel de roupas, desenvolvido com tecnologias web modernas e empacotado como aplicação nativa Linux (Debian/Ubuntu).

O sistema permite gerenciar produtos, clientes, aluguéis e pagamentos, com persistência local via banco de dados SQLite.

# 🧠 Visão Geral da Arquitetura

O projeto segue uma arquitetura desktop híbrida, composta por:

- Frontend em React (SPA)
- Backend local em Express (Node.js)
- Banco de dados local SQLite
- Shell desktop e empacotamento via Tauri (Rust)

Todo o sistema roda offline, sem dependência de servidores externos.

# 📁 Estrutura do Projeto

```bash
lojaDeRoupas
├── backend                # Backend Express + SQLite
│   ├── controllers
│   ├── routes
│   ├── database
│   └── utils
├── public                 # Build final do frontend
├── src                    # Frontend React
│   ├── assets
│   ├── components
│   └── services
├── src-tauri              # Aplicação Tauri (Rust)
│   ├── icons
│   ├── src
│   └── target             # Artefatos de build (ignorado no Git)
└── README.md
```

# 🛠 Tecnologias Utilizadas

## Desktop / Build

- Tauri 2.x — Shell desktop, segurança e empacotamento
- Rust — Core da aplicação Tauri

## Frontend

- React 18
- Webpack
- Tailwind CSS

## Backend

- Node.js
- Express
- SQLite


# 🚀 Execução em Ambiente de Desenvolvimento

## Pré-requisitos

- Node.js 18+
- Rust (toolchain estável)
- Dependências do Tauri (ver documentação oficial)

## Instalar Dependências
```bash
   npm install
```
## Rodar backend + frontend (mode web):
```bash
    npm run dev
```
Isso iniciará:

- Servidor backend (Express + SQLite)
- Frontend React via Webpack Dev Server

Para acessá-los:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Rodar como aplicativo desktop

```bash
npx tauri dev
```

# 🗄 Banco de Dados
O banco SQLite é criado automaticamente em:
```bash
backend/database/loja.db.
```
Não é necessário nenhum setup manual.

## Rodar como aplicativo desktop (Tauri)

```bash
npx tauri dev
```

# 📦 Build e Geração do Instalador (.deb)

Para gerar o instalador Linux (Debian/Ubuntu):

```bash
npx tauri build
```

O pacote .deb será gerado em:

```bash
src-tauri/target/release/bundle/deb/
```

## Instalação do Pacote
Após o build:

```bash
sudo dpkg -i loja-aluguel-roupas_*.deb
```

# 📄 Licença

Este projeto é de uso educacional e/ou interno.
Defina uma licença (MIT, GPL, etc.) conforme a finalidade do projeto.

# 📌 Status do Projeto

✔ Funcional
✔ Instalável via .deb
✔ Backend embutido
✔ Persistência local
✔ Pronto para uso offline