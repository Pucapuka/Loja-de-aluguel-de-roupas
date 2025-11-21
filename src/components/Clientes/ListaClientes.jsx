import React, { useEffect, useState } from "react";
import FormClientes from "./FormClientes";

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [editarCliente, setEditarCliente] = useState(null);
  const [filtro, setFiltro] = useState("");

  const carregar = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/clientes");
      if (!res.ok) throw new Error("Erro ao carregar clientes");
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/clientes/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) throw new Error("Erro ao excluir cliente");
      carregar();
    } catch (err) {
      alert("Erro ao excluir cliente: " + err.message);
    }
  };

  const handleEditar = (cliente) => setEditarCliente(cliente);
  const handleSalvarEdicao = () => { 
    setEditarCliente(null); 
    carregar(); 
  };

  const handleCancelarEdicao = () => {
    setEditarCliente(null);
  };

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.telefone?.includes(filtro)
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🧍 Clientes</h2>
      
      <FormClientes 
        onSave={editarCliente ? handleSalvarEdicao : carregar} 
        editar={editarCliente}
      />

      {editarCliente && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            Editando: <strong>{editarCliente.nome}</strong>
            <button 
              onClick={handleCancelarEdicao}
              className="ml-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
            >
              Cancelar Edição
            </button>
          </p>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Lista de Clientes ({clientesFiltrados.length})
            </h3>
            
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{cliente.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {cliente.telefone && <div>📞 {cliente.telefone}</div>}
                        {cliente.email && <div>✉️ {cliente.email}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {cliente.endereco || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditar(cliente)}
                          className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleExcluir(cliente.id)}
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