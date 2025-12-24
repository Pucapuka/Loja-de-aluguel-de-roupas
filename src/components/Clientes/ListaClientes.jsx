import React, { useEffect, useState } from "react";
import FormClientes from "./FormClientes.jsx";
import api from '../../services/api.js';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [editarCliente, setEditarCliente] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true); // novo estado de loading
  const [error, setError] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Buscando produtos...");
      const response = await api.get("/clientes");
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

      console.log(`📦 ${dados.length} clientes carregados`);
      setClientes(dados);
    } catch (err) {
      console.error('❌ Erro ao carregar clientes:', err);
      setError("Não foi possível carregar os clientes. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar() }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      carregar();
    } catch (err) {
      alert("Erro ao excluir cliente: " + err.message);
    }
  };

  const handleEditar = (cliente) => {
    setEditarCliente(cliente);
    setMostrarFormulario(true);
  };

  const handleSalvarEdicao = () => { 
    setEditarCliente(null); 
    setMostrarFormulario(false);
    carregar(); 
  };

  const handleCancelarEdicao = () => {
    setEditarCliente(null);
    setMostrarFormulario(false);
  };

  const handleNovoCliente = () => {
    setEditarCliente(null);
    setMostrarFormulario(true);
  };

  const handleCancelarNovo = () => {
    setMostrarFormulario(false);
    setEditarCliente(null);
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return '-';
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length !== 11) return cpf;
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const clientesFiltrados = Array.isArray(clientes) 
  ? clientes.filter(cliente => {
   if (!filtro) return true;
        return cliente.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
               cliente.tamanho?.toLowerCase().includes(filtro.toLowerCase());
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
        <h2 className="text-2xl font-bold text-gray-800">🧍 Clientes</h2>
        <button 
          onClick={handleNovoCliente}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          ➕ Novo Cliente
        </button>
      </div>

      {(mostrarFormulario || editarCliente) && (
        <div className="mb-6">
          <FormClientes 
            onSave={editarCliente ? handleSalvarEdicao : () => { setMostrarFormulario(false); carregar(); }} 
            editar={editarCliente}
          />
          <div className="mt-2 flex justify-end">
            <button 
              onClick={editarCliente ? handleCancelarEdicao : handleCancelarNovo}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {editarCliente && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            Editando: <strong>{editarCliente.nome}</strong>
          </p>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Lista de Clientes ({clientesFiltrados.length})
          </h3>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nome, CPF, email ou telefone..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {clientesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {clientes.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum cliente encontrado"}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cliente.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{cliente.cpf ? formatarCPF(cliente.cpf) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {cliente.telefone && <div className="flex items-center gap-1">📞 {cliente.telefone}</div>}
                      {cliente.email && <div className="flex items-center gap-1">✉️ {cliente.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{cliente.endereco || "-"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleEditar(cliente)} className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium">Editar</button>
                      <button onClick={() => handleExcluir(cliente.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-medium">Excluir</button>
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
