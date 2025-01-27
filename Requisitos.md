# Requisitos do Projeto: Loja de Aluguéis de Roupas

## Funcionalidades

- **Cadastro de Produtos**:
  - Inserção de vestidos, ternos e bolsas.
  - Descrição, tamanho, cor, disponibilidade e preço de aluguel.

- **Gestão de Estoque**:
  - Atualização automática de disponibilidade após o aluguel ou devolução.
  - Histórico de uso de cada item.

- **Cadastro de Clientes**:
  - Dados básicos (nome, telefone, e-mail).
  - Histórico de aluguéis.

- **Sistema de Aluguéis**:
  - Registro do item alugado, data de retirada e devolução.
  - Cálculo automático do preço total.

- **Filtros de Busca**:
  - Filtragem por categoria, cor, tamanho, preço, ou disponibilidade.

- **Painel Administrativo**:
  - Resumo de itens disponíveis e alugados.
  - Relatórios de uso e faturamento.

- **Autenticação e Autorização**:
  - Login para administradores e operadores.
  - Permissões baseadas em funções.

---

## Tecnologias

- **Frontend**: React com TypeScript (para maior tipagem e robustez).
- **Backend**: Node.js com Express.
- **Banco de Dados**: PostgreSQL (relacional, ideal para manter relações claras entre clientes, produtos e aluguéis).
- **Hospedagem do Banco**: Na nuvem (mais recomendado para o portifólio, para dar acessibilidade a quem quiser ver e escalabilidade).
- **Estilo**: Tailwind CSS ou Material-UI para uma interface profissional.

---

## Estrutura do Banco de Dados

- **Clientes**:
  - ID, Nome, Telefone, E-mail, Histórico de Aluguéis.
- **Produtos**:
  - ID, Tipo (vestido, terno, bolsa), Tamanho, Cor, Preço, Disponibilidade.
- **Aluguéis**:
  - ID, ClienteID, ProdutoID, Data de Retirada, Data de Devolução, Valor Total.

---

## Ferramentas Adicionais

- **CI/CD**: Integração com GitHub Actions.
- **Documentação**: Swagger para API.
