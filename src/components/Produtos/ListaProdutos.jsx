import React, { useEffect, useState } from "react";
import FormProdutos from "./FormProdutos.jsx";
import api from '../../services/api.js';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [editarProduto, setEditarProduto] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true); // novo estado de loading
  const [error, setError] = useState(null);     // novo estado de erro

  
  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Buscando produtos...");
      const response = await api.get("/produtos");
      console.log('✅ Resposta da API:', response);
      //verifica se a resposta tem dados
      let dados = response.data;

      //se for um objeto com propriedade data, ajuste
      if(dados && dados.data && Array.isArray(dados.data)){
        dados = dados.data;
      }

      // Garante que seja um array
      if (!Array.isArray(dados)) {
        console.warn('⚠️ Dados não são um array:', dados);
        dados = [];
      }

      console.log(`📦 ${dados.length} produtos carregados`);
      setProdutos(dados);
    } catch (err) {
      console.error('❌ Erro ao carregar produtos:', err);
      setError("Não foi possível carregar os produtos. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {carregar()}, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      carregar();
    } catch (err) {
      alert("Erro ao excluir produto: " + err.message);
    }
  };

  const handleEditar = (produto) => {
    setEditarProduto(produto);
    setMostrarFormulario(true);
  };

  const handleSalvarEdicao = () => { 
    setEditarProduto(null); 
    setMostrarFormulario(false);
    carregar(); 
  };

  const handleCancelarEdicao = () => {
    setEditarProduto(null);
    setMostrarFormulario(false);
  };

  const handleNovoProduto = () => {
    setEditarProduto(null);
    setMostrarFormulario(true);
  };

  const handleCancelarNovo = () => {
    setMostrarFormulario(false);
    setEditarProduto(null);
  };

 // Filtra produtos
  const produtosFiltrados = Array.isArray(produtos) 
    ? produtos.filter(produto => {
        if (!filtro) return true;
        return produto.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
               produto.tamanho?.toLowerCase().includes(filtro.toLowerCase());
      })
    : [];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Erro</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Dados de exemplo estão sendo exibidos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📦 Produtos</h2>
        <button 
          onClick={handleNovoProduto}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          ➕ Novo Produto
        </button>
      </div>

      {(mostrarFormulario || editarProduto) && (
        <div className="mb-6">
          <FormProdutos 
            onSave={editarProduto ? handleSalvarEdicao : () => { setMostrarFormulario(false); carregar(); }} 
            editar={editarProduto}
          />
          <div className="mt-2 flex justify-end">
            <button 
              onClick={editarProduto ? handleCancelarEdicao : handleCancelarNovo}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {editarProduto && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            Editando: <strong>{editarProduto.nome}</strong>
          </p>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">Carregando produtos...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="mt-6 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Lista de Produtos ({produtosFiltrados.length})
            </h3>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nome ou código..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {produtosFiltrados.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {produtos.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado"}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {produtosFiltrados.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{produto.nome}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{produto.codigo || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">R$ {produto.preco?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{produto.estoque ?? 0}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => handleEditar(produto)} className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium">Editar</button>
                        <button onClick={() => handleExcluir(produto.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-medium">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
