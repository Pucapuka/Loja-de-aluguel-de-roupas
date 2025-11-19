# App Generalista para uma Loja de Roupas

## Estrutura do aplicativo

loja-aluguel-roupas/
│
├── package.json
├── electron.js
├── webpack.config.js
│
├── /public
│   └── index.html
│
├── /src
│   ├── index.js
│   ├── App.jsx
│   ├── components/
│   │   ├── RoupasList.jsx
│   │   ├── ClientesList.jsx
│   │   └── AlugueisList.jsx
│   └── services/
│       └── api.js
│
├── /backend
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   ├── roupas.js
│   │   ├── clientes.js
│   │   └── alugueis.js
│   └── database/
│       └── loja.db
│
└── README.md


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


