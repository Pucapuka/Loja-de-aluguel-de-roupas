# App Generalista para uma Loja de Roupas
Desenvolvido para ambiente Linux (dist. Debian), usando tecnologias para desenvolvimento web, com pacotes de instaladores e builders. Essa estrutura já foi testada e consegue gerar um instalável para SO Linux debian.

## Estrutura do aplicativo

lojaDeRoupas
├── backend
│   ├── database
│   │   ├── databaseCode.txt
│   │   ├── loja.db
│   │   └── setup.sql
│   ├── db.js
│   ├── routes
│   │   ├── alugueis.js
│   │   ├── clientes.js
│   │   └── roupas.js
│   └── server.js
├── criar-pacote.sh
├── debian
│   ├── changelog
│   ├── control
│   ├── postinst
│   └── prerm
├── electron.js
├── instaladores
│   ├── criar-appimage.sh
│   ├── criar-deb.sh
│   └── instalar-gui.sh
├── install.sh
├── jest.config.js
├── jest.setup.js
├── loja-roupas_1.0.3_all.deb
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── bundle.js
│   ├── bundle.js.LICENSE.txt
│   └── index.html
├── README.md
├── Requisitos.md
├── scripts
├── src
│   ├── App.jsx
│   ├── components
│   │   ├── Alugueis
│   │   │   ├── FormAlugueis.jsx
│   │   │   └── ListaAlugueis.jsx
│   │   ├── Clientes
│   │   │   ├── FormClientes.jsx
│   │   │   └── ListaClientes.jsx
│   │   ├── Layout
│   │   │   └── NavBar.jsx
│   │   └── Roupas
│   │       ├── FormRoupas.jsx
│   │       └── ListaRoupas.jsx
│   ├── index.css
│   ├── index.js
│   └── services
│       └── api.js
├── tailwind.config.js
├── tsconfig.json
├── usr
│   ├── local
│   │   └── loja-roupas
│   │       └── iniciar-loja.sh
│   └── share
│       └── applications
└── webpack.config.js


## Descrição

O app foi desenvolvido utilizando:

### Electron
 Esta ferramenta inicializa o app (cria janela desktop).

### React 
Biblioteca para trabalhar a exibição da interface (cadastro, listas, relatórios etc.).

### Express 
Framework JavaScript que roda embutido dentro do Electron (como backend local).

### SQLite 
Sistema de Gerenciamento de Banco de Dados, que armazena os dados localmente (loja.db).


# 👗 Sistema de Aluguel de Roupas (Desktop)

Aplicativo desktop desenvolvido com **Electron + React + Express + SQLite**.

---

## 🚀 Como rodar

1. Instale as dependências:
```bash
   npm install
```
2. Execute o app:
```bash
    npm start
```
Isso iniciará:

- Servidor backend (Express + SQLite)

- Interface React

- Janela desktop do Electron

3. Banco de dados:

- O arquivo SQLite é criado automaticamente em backend/database/loja.db.

## 📦 Build (gerar instalador)

Para gerar o instalador (ex: .exe), adicione o **electron-builder** :

```bash
npm install --save-dev electron-builder
```
E no package.json:

```json
"build": {
  "appId": "com.loja.aluguel.roupas",
  "productName": "Loja de Aluguel de Roupas",
  "directories": { "output": "dist" }
}
```

Depois:
```bash
npx electron-builder
```

# Empacotamento (Para Dist Debian)

## Loja de Roupas - Empacotamento

### Para gerar o pacote .deb:

```bash
# Tornar executável
chmod +x criar-pacote.sh

# Gerar pacote
./criar-pacote.sh
```