# 👗 Loja de Aluguel de Roupas - Aplicação Web

Aplicação web full-stack para gestão completa de uma loja de aluguel de roupas. Desenvolvida com React (frontend), Node.js/Express (backend) e SQLite (banco de dados), com empacotamento simplificado via Docker para fácil implantação.

## 🚀 Visão Geral

Sistema completo para gerenciar produtos, clientes, aluguéis e pagamentos de uma loja de roupas. A aplicação é **autocontida** e funciona **totalmente offline**, ideal para uso em pequenos negócios ou ambientes locais.

**Características principais:**
- ✅ Interface web moderna com React
- ✅ API REST completa com Node.js/Express
- ✅ Banco de dados SQLite embutido
- ✅ Empacotamento Docker para fácil implantação
- ✅ Persistência automática de dados
- ✅ Inicialização automática com o sistema
- ✅ Instalação simplificada (1 comando)

## 📁 Estrutura do Projeto

```
loja-aluguel-roupas/
├── backend/                   # Backend Node.js + Express
│   ├── controllers/          # Lógica de negócio
│   │   ├── produtoController.js
│   │   ├── clienteController.js
│   │   ├── aluguelController.js
│   │   └── pagamentoController.js
│   ├── routes/               # Rotas da API
│   │   ├── produtosRoutes.js
│   │   ├── clientesRoutes.js
│   │   ├── alugueisRoutes.js
│   │   └── pagamentosRoutes.js
│   ├── db.js                # Configuração do SQLite
│   └── server.js            # Servidor Express
├── src/                     # Frontend React
│   ├── assets/             # Imagens, ícones
│   ├── components/         # Componentes React
│   ├── services/           # Comunicação com API
│   ├── App.jsx             # Componente principal
│   └── ...                 # Outros arquivos React
├── docker-compose.yml      # Orquestração de containers
├── Dockerfile             # Imagem Docker otimizada
├── docker-entrypoint.sh   # Script de inicialização
├── package.json          # Dependências Node.js
├── webpack.config.js     # Build do frontend
└── data/                 # Dados do SQLite (criado automaticamente)
```

## 🛠 Tecnologias

- **Frontend**: React 18, Webpack, Tailwind CSS
- **Backend**: Node.js 18, Express, SQLite3
- **Containerização**: Docker, Docker Compose
- **Ferramentas**: Webpack, Babel, npm scripts

## 🐳 Implantação com Docker (RECOMENDADO)

### Pré-requisitos
- Docker Engine
- Docker Compose
- 500MB de espaço em disco

### Instalação em 1 Passo (Para Clientes)

1. **Baixe o pacote** `PacoteLoja.zip`
2. **Extraia** em qualquer pasta
3. **Execute no terminal**:
   ```bash
   cd PacoteLoja
   sudo bash INSTALAR.sh
   ```
4. **Acesse no navegador**: `http://localhost:5000`

### Instalação Manual (Para Desenvolvedores)

```bash
# Clone o repositório
git clone <seu-repositorio>
cd loja-aluguel-roupas

# Construa e execute
docker-compose up -d --build

# Verifique os logs
docker-compose logs -f
```

### Comandos Docker Úteis

```bash
# Iniciar aplicação
docker-compose up -d

# Parar aplicação
docker-compose down

# Reiniciar
docker-compose restart

# Ver logs em tempo real
docker-compose logs -f

# Ver status dos containers
docker-compose ps

# Acessar shell do container
docker exec -it loja-aluguel-roupas sh
```

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Configuração do Ambiente

```bash
# Instalar dependências
npm install

# Desenvolvimento (frontend + backend)
npm run dev

# Build do frontend para produção
npm run build:web

# Executar apenas o backend
npm run dev:backend

# Executar apenas o frontend
npm run dev:web
```

### Scripts Disponíveis (package.json)

```bash
# Desenvolvimento completo
npm run dev

# Build para produção
npm run build:web

# Docker (local)
npm run docker:build    # Construir imagem
npm run docker:run      # Executar container
npm run docker:dev      # Desenvolvimento com Docker
npm run docker:prod     # Produção com Docker
npm run docker:logs     # Ver logs
npm run docker:stop     # Parar containers
```

## 🔧 Configuração

### Variáveis de Ambiente

A aplicação usa as seguintes variáveis (definidas no docker-compose.yml):

```env
NODE_ENV=production
PORT=5000
DOCKER_ENV=true
DB_PATH=/home/nodejs/data/loja.db
```

### Persistência de Dados

- **Localização**: `./data/loja.db` (fora do container)
- **Backup**: Copie a pasta `./data`
- **Restauração**: Substitua a pasta `./data`

## 📡 API Backend

### Endpoints Principais

#### Clientes
```
GET    /api/clientes          # Listar todos os clientes
POST   /api/clientes          # Criar novo cliente
PUT    /api/clientes/:id      # Atualizar cliente
DELETE /api/clientes/:id      # Remover cliente
```

#### Produtos
```
GET    /api/produtos          # Listar todos os produtos
POST   /api/produtos          # Criar novo produto
PUT    /api/produtos/:id      # Atualizar produto
DELETE /api/produtos/:id      # Remover produto
```

#### Aluguéis
```
GET    /api/alugueis          # Listar todos os aluguéis
POST   /api/alugueis          # Criar novo aluguel
GET    /api/alugueis/:id      # Detalhes completos do aluguel
PATCH  /api/alugueis/:id/finalizar  # Finalizar aluguel
```

#### Pagamentos
```
POST   /api/pagamentos        # Registrar pagamento
PATCH  /api/pagamentos/:id/pagar  # Marcar pagamento como realizado
```

#### Sistema
```
GET    /api/health            # Verificar saúde da aplicação
GET    /api/init              # Inicializar banco com dados de exemplo
```

### Exemplo de Requisição

```javascript
// Criar novo cliente
fetch('/api/clientes', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-9999"
  })
})
```

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro "Permission denied" ao iniciar**
   ```bash
   # Execute o instalador com sudo
   sudo bash INSTALAR.sh
   ```

2. **Container não inicia**
   ```bash
   # Force a recriação
   docker-compose down
   docker-compose up -d --force-recreate
   ```

3. **Banco de dados não persiste**
   - Verifique se a pasta `./data` existe
   - Verifique permissões: `ls -la ./data`

4. **Erro "port already in use"**
   ```bash
   # Pare outros containers na porta 5000
   docker-compose down
   sudo lsof -ti:5000 | xargs kill -9
   ```

### Logs e Diagnóstico

```bash
# Ver logs da aplicação
docker-compose logs app

# Ver logs específicos de erro
docker-compose logs | grep -i error

# Ver uso de recursos
docker stats loja-aluguel-roupas

# Ver informações do container
docker inspect loja-aluguel-roupas
```

## 📦 Empacotamento para Distribuição

### Criar Pacote para Cliente

```bash
# Na raiz do projeto
mkdir -p PacoteLoja
cp docker-compose.yml PacoteLoja/
cp INSTALAR.sh PacoteLoja/
cp LEIA-ME.txt PacoteLoja/
chmod +x PacoteLoja/INSTALAR.sh

# Compactar
zip -r PacoteLoja.zip PacoteLoja/
```

### Estrutura do Pacote de Entrega

```
PacoteLoja/
├── docker-compose.yml      # Configuração do container
├── INSTALAR.sh            # Instalador automatizado
├── LEIA-ME.txt           # Instruções para o cliente
└── data/                 # Pasta para dados (criada automaticamente)
```

## 🔒 Segurança

- Aplicação roda com usuário não-root (`nodejs`) dentro do container
- Dados persistentes fora do container (facilita backup)
- Health checks automáticos
- Restart automático em caso de falha

## 📄 Licença

Este projeto é destinado para uso educacional e comercial. Consulte os arquivos de licença para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas:
1. Verifique a seção de Solução de Problemas
2. Consulte os logs da aplicação
3. Entre em contato com o desenvolvedor.

---

**Versão**: 1.6  
**Última Atualização**: Dezembro 2024  
**Status**: ✅ Produção

> **Nota**: Esta aplicação é otimizada para execução em Docker. Para desenvolvimento local, use os scripts `npm run dev`.