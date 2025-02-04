# Loja de Aluguéis de Roupas

Um aplicativo para gestão de aluguéis de vestidos, ternos e bolsas para eventos.

##Arquitetura
- **Em camadas (Layered Architecture)

🔹 Arquitetura do Backend
A estrutura do backend está organizada da seguinte forma:

📂 backend/
├── 📂 database/ → Configuração do banco de dados
├── 📂 src/
│ ├── 📂 controllers/ → Controladores (lógica de requisição e resposta)
│ │ ├── aluguelController.ts
│ │ ├── clienteController.ts
│ │ ├── produtoController.ts
│ ├── 📂 models/ → Modelos (definição das entidades)
│ │ ├── Aluguel.ts
│ │ ├── Cliente.ts
│ │ ├── Produto.ts
│ ├── 📂 routers/ → Rotas da API
│ │ ├── aluguelRoutes.ts
│ │ ├── clienteRoutes.ts
│ │ ├── produtoRoutes.ts
│ ├── 📂 services/ → Lógica de negócios e comunicação com o banco
│ │ ├── db.ts
│ ├── 📂 tests/ → Testes unitários e de integração
│ ├── app.ts → Configuração do servidor
│ ├── server.ts → Inicialização do servidor
├── 📂 dist/ → Código compilado
├── 📂 node_modules/ → Dependências do Node.js


## Tecnologias
- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL

## Funcionalidades
1. Cadastro e gerenciamento de produtos (vestidos, ternos, bolsas).
2. Controle de estoque e aluguéis.
3. Cadastro de clientes e histórico.
4. Autenticação para administradores.

## Configuração
1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
