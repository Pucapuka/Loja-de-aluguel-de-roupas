# 👗 Sistema de Aluguel de Roupas
### Manual do Usuário — Versão Desktop

## 💻 Requisitos do Sistema

- Sistema operacional: Ubuntu / Debian
- Arquitetura: 64 bits
- Não requer internet após a instalação

## 📦 Instalação

1. Receba o arquivo instalador:
```bash
loja-aluguel-roupas_X.Y.Z_amd64.deb
```
2. Abra o terminal na pasta do arquivo e execute:
```bash
sudo dpkg -i loja-aluguel-roupas_*.deb
```
3. Caso apareça erro de dependência:
```bash
sudo apt --fix-broken install
```
## ▶ Como Abrir o Programa

Após instalado:

- Procure por “Loja de Roupas” no menu de aplicativos

ou

- Execute pelo terminal:
```bash
loja-aluguel-roupas
```

# 🧾 Funcionalidades Principais
## 📦 Produtos

- Cadastro de roupas
- Edição e exclusão
- Controle de estoque

## 👤 Clientes

- Cadastro de clientes
- Edição de dados
- Histórico de aluguéis

## 📅 Aluguéis

- Registro de novos aluguéis
- Associação cliente × produto
- Controle de datas

## 💰 Pagamentos

- Registro de pagamentos
- Consulta de valores

## 🗄 Armazenamento de Dados

- Todos os dados ficam salvos localmente
- Não há envio de informações para a internet
- O banco é protegido no próprio computador

## 🔒 Segurança

- Aplicação roda localmente
- Sem dependência de servidores externos
- Banco de dados isolado no sistema

## ❓ Problemas Comuns

### O programa não abre

- Verifique se está usando Ubuntu/Debian 64 bits
- Execute pelo terminal para ver mensagens de erro

### Perdi meus dados
- Os dados ficam no computador onde o sistema foi instalado
- Não são sincronizados. Recomendo, portanto, que salve seus dados em um disco rígido (HD ou SSD externo) ou em um armazenamento virtual (Google Drive, Dropbox, Megaupload etc.)

### 📞 Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor responsável:

- Paulo Anderson Gonçalves de Lima
- solucoes.magic.ti@gmail.com