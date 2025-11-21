import React, { useEffect, useState } from "react";
import FormRoupas from "./FormRoupas";

export default function ListaRoupas() {
  const [roupas, setRoupas] = useState([]);
  const [editarRoupa, setEditarRoupa] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const carregar = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roupas");
      if (!res.ok) throw new Error("Erro ao carregar roupas");
      const data = await res.json();
      setRoupas(data);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta roupa?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/roupas/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) throw new Error("Erro ao excluir roupa");
      carregar();
    } catch (err) {
      alert("Erro ao excluir roupa: " + err.message);
    }
  };

  const handleEditar = (roupa) => setEditarRoupa(roupa);
  const handleSalvarEdicao = () => { 
    setEditarRoupa(null); 
    carregar(); 
  };

  const handleCancelarEdicao = () => {
    setEditarRoupa(null);
  };

  // Filtrar roupas
  const roupasFiltradas = roupas.filter(roupa => {
    const matchBusca = 
      roupa.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      roupa.cor?.toLowerCase().includes(filtro.toLowerCase()) ||
      roupa.tamanho?.toLowerCase().includes(filtro.toLowerCase());
    
    const matchStatus = filtroStatus === "todos" || roupa.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponível': return 'bg-green-100 text-green-800';
      case 'reservado': return 'bg-yellow-100 text-yellow-800';
      case 'alugado': return 'bg-red-100 text-red-800';
      case 'em manutenção': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'disponível': return '🟢';
      case 'reservado': return '🟡';
      case 'alugado': return '🔴';
      case 'em manutenção': return '🟠';
      default: return '⚪';
    }
  };

  const contarPorStatus = (status) => {
    return roupas.filter(roupa => roupa.status === status).length;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">👗 Gerenciar Roupas</h2>
      
      <FormRoupas 
        onSave={editarRoupa ? handleSalvarEdicao : carregar} 
        editar={editarRoupa}
      />

      {editarRoupa && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800">
            Editando: <strong>{editarRoupa.nome}</strong>
            <button 
              onClick={handleCancelarEdicao}
              className="ml-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
            >
              Cancelar Edição
            </button>
          </p>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Estoque de Roupas ({roupasFiltradas.length})
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nome, cor ou tamanho..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
              >
                <option value="todos">Todos os status</option>
                <option value="disponível">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="alugado">Alugado</option>
                <option value="em manutenção">Manutenção</option>
              </select>
            </div>
          </div>

          {/* Status Summary */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span>🟢</span> Disponível: {contarPorStatus('disponível')}
            </span>
            <span className="flex items-center gap-1">
              <span>🟡</span> Reservado: {contarPorStatus('reservado')}
            </span>
            <span className="flex items-center gap-1">
              <span>🔴</span> Alugado: {contarPorStatus('alugado')}
            </span>
            <span className="flex items-center gap-1">
              <span>🟠</span> Manutenção: {contarPorStatus('em manutenção')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {roupasFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {roupas.length === 0 ? "Nenhuma roupa cadastrada" : "Nenhuma roupa encontrada"}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roupa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roupasFiltradas.map((roupa) => (
                  <tr key={roupa.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{roupa.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {roupa.tamanho && <span className="mr-2">Tamanho: {roupa.tamanho}</span>}
                        {roupa.cor && <span>Cor: {roupa.cor}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-green-600">
                        R$ {parseFloat(roupa.preco_aluguel || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(roupa.status)}`}>
                        {getStatusIcon(roupa.status)} {roupa.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditar(roupa)}
                          className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleExcluir(roupa.id)}
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