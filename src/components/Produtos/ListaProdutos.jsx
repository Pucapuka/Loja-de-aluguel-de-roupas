import React, { useEffect, useState } from "react";
import FormProdutos from "./FormProdutos";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]); // CORREÇÃO: mudado de "roupas" para "produtos"
  const [editarProduto, setEditarProduto] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const res = await fetch("http://localhost:5000/api/produtos");
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setErro(err.message);
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { 
    carregar(); 
  }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/produtos/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) throw new Error("Erro ao excluir produto");
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

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.cor?.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.tamanho?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👗 Produtos</h2>
        <button 
          onClick={handleNovoProduto}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          ➕ Novo Produto
        </button>
      </div>
      
      {/* Estados de loading e erro */}
      {carregando && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded mb-4">
          Carregando produtos...
        </div>
      )}
      
      {erro && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          Erro ao carregar produtos: {erro}
          <button 
            onClick={carregar}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Formulário - Mostrar apenas quando necessário */}
      {(mostrarFormulario || editarProduto) && (
        <div className="mb-6">
          <FormProdutos 
            onSave={editarProduto ? handleSalvarEdicao : () => {
              setMostrarFormulario(false);
              carregar();
            }} 
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

      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Lista de Produtos ({produtosFiltrados.length})
            </h3>
            
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nome, código, cor ou tamanho..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {!carregando && !erro && produtosFiltrados.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {produtos.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado"}
            </div>
          )}

          {produtosFiltrados.length > 0 && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Aluguel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 font-mono">{produto.codigo}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{produto.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{produto.tamanho || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{produto.cor || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        R$ {parseFloat(produto.preco_aluguel || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm font-medium ${
                        produto.estoque > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {produto.estoque || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditar(produto)}
                          className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleExcluir(produto.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}