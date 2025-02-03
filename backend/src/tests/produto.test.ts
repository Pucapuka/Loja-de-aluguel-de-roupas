import request from 'supertest';
import app from '../app'; // Importa a instância do Express
import db from '../services/db'; // Importa a conexão com o banco

// Produto de teste
const produtoTeste = {
  nome: 'Produto Teste',
  descricao: 'Descrição do produto de teste',
  preco: 99.99,
  quantidade: 10,
};

let produtoId: number; // Variável para armazenar o ID do produto criado

// Antes de todos os testes, limpa o banco e insere um produto inicial
beforeAll(async () => {
  await db.query('DELETE FROM produtos'); // Limpa os produtos antes de iniciar os testes
  const res = await db.query(
    'INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES ($1, $2, $3, $4) RETURNING id',
    [produtoTeste.nome, produtoTeste.descricao, produtoTeste.preco, produtoTeste.quantidade]
  );
  produtoId = res.rows[0].id;
});

// Após todos os testes, fecha a conexão com o banco
afterAll(async () => {
  await db.end();
});

describe('🛒 Testes de Rotas de Produtos', () => {
  it('🔎 Deve listar todos os produtos', async () => {
    const res = await request(app).get('/api/produtos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('➕ Deve criar um novo produto', async () => {
    const res = await request(app).post('/api/produtos').send({
      nome: 'Novo Produto',
      descricao: 'Descrição do novo produto',
      preco: 49.90,
      quantidade: 20,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Novo Produto');
  });

  it('📌 Deve buscar um produto por ID', async () => {
    const res = await request(app).get(`/api/produtos/${produtoId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(produtoId);
    expect(res.body.nome).toBe(produtoTeste.nome);
  });

  it('✏️ Deve atualizar um produto existente', async () => {
    const res = await request(app).put(`/api/produtos/${produtoId}`).send({
      nome: 'Produto Atualizado',
      descricao: 'Nova descrição',
      preco: 150.00,
      quantidade: 30,
    });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Produto Atualizado');
  });

  it('🗑️ Deve deletar um produto', async () => {
    const res = await request(app).delete(`/api/produtos/${produtoId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Produto excluído com sucesso');
  });

  it('🚫 Deve retornar erro ao buscar produto inexistente', async () => {
    const res = await request(app).get(`/api/produtos/9999`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Produto não encontrado');
  });
});

/*

🔥 Explicação do Código

✅ beforeAll → Limpa o banco e insere um produto de teste antes dos testes rodarem.
✅ afterAll → Fecha a conexão com o banco ao final dos testes.
✅ Testes individuais para cada funcionalidade:

    GET /api/produtos → Lista todos os produtos.
    POST /api/produtos → Cria um novo produto.
    GET /api/produtos/:id → Busca um produto pelo ID.
    PUT /api/produtos/:id → Atualiza um produto.
    DELETE /api/produtos/:id → Deleta um produto.
    Erro esperado ao tentar buscar um produto que não existe.

*/