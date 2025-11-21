import React, { useEffect, useState } from "react";
import FormAlugueis from "./FormAlugueis";

export default function ListaAlugueis() {
  const [alugueis, setAlugueis] = useState([]);
  const [editarAluguel, setEditarAluguel] = useState(null);
  const [detalhesAluguel, setDetalhesAluguel] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const res = await fetch("http://localhost:5000/api/alugueis");
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Garante que data seja um array
      if (Array.isArray(data)) {
        setAlugueis(data);
      } else {
        console.warn('API não retornou um array:', data);
        setAlugueis([]);
      }
    } catch (err) {
      console.error('Erro ao carregar aluguéis:', err);
      setErro(err.message);
      setAlugueis([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { 
    carregar(); 
  }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este aluguel?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/alugueis/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) throw new Error("Erro ao excluir aluguel");
      carregar();
    } catch (err) {
      alert("Erro ao excluir aluguel: " + err.message);
    }
  };

  const handleEditar = (a) => setEditarAluguel(a);
  const handleSalvarEdicao = () => { 
    setEditarAluguel(null); 
    carregar(); 
  };

  const verDetalhes = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alugueis/${id}/itens`);
      
      if (!res.ok) throw new Error("Erro ao carregar detalhes");
      
      const itens = await res.json();
      setDetalhesAluguel({ id, itens });
    } catch (err) {
      console.error("Erro ao carregar detalhes:", err);
      alert("Erro ao carregar detalhes: " + err.message);
    }
  };

  const finalizarAluguel = async (id) => {
    if (!window.confirm("Deseja finalizar este aluguel?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/alugueis/${id}/finalizar`, { 
        method: "PUT" 
      });
      
      if (!res.ok) throw new Error("Erro ao finalizar aluguel");
      carregar();
    } catch (err) {
      alert("Erro ao finalizar aluguel: " + err.message);
    }
  };

  // Adicione esta função para debug
  const verificarAPI = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/alugueis");
      const data = await res.json();
      console.log('Resposta da API /api/alugueis:', data);
      console.log('Tipo:', typeof data);
      console.log('É array?', Array.isArray(data));
    } catch (err) {
      console.error('Erro ao verificar API:', err);
    }
  };

  // Debug - verifique a API quando o componente montar
  useEffect(() => {
    verificarAPI();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📦 Aluguéis</h2>
      
      {/* Botão de debug */}
      <button 
        onClick={verificarAPI}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded text-sm"
      >
        Debug API
      </button>

      <FormAlugueis 
        onSave={editarAluguel ? handleSalvarEdicao : carregar} 
        editar={editarAluguel} 
      />
      
      {/* Estados de loading e erro */}
      {carregando && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
          Carregando aluguéis...
        </div>
      )}
      
      {erro && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          Erro ao carregar aluguéis: {erro}
          <button 
            onClick={carregar}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Modal de detalhes */}
      {detalhesAluguel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalhes do Aluguel #{detalhesAluguel.id}</h3>
              <button 
                onClick={() => setDetalhesAluguel(null)} 
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {Array.isArray(detalhesAluguel.itens) && detalhesAluguel.itens.length > 0 ? (
                detalhesAluguel.itens.map((item) => (
                  <div key={item.item_id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <div className="font-medium">{item.roupa_nome}</div>
                      <div className="text-sm text-gray-600">
                        {item.tamanho} - {item.cor}
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{item.quantidade} x R$ {item.valor_unitario}</div>
                      <div className="font-bold">R$ {item.total_parcial}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Nenhum item encontrado para este aluguel
                </div>
              )}
              {Array.isArray(detalhesAluguel.itens) && detalhesAluguel.itens.length > 0 && (
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded font-bold">
                  <span>TOTAL</span>
                  <span>R$ {detalhesAluguel.itens[0]?.valor_total || '0.00'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de aluguéis */}
      <div className="mt-6 space-y-4">
        {!carregando && !erro && Array.isArray(alugueis) && alugueis.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhum aluguel encontrado
          </div>
        )}

        {Array.isArray(alugueis) && alugueis.map((a) => (
          <div key={a.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-bold">Aluguel #{a.id}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    a.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {a.status || 'ativo'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Cliente:</strong> {a.cliente_nome || `Cliente #${a.cliente_id}`}</p>
                  <p><strong>Período:</strong> {a.data_inicio} → {a.data_fim}</p>
                  <p><strong>Itens:</strong> {a.total_itens || 0}</p>
                  <p><strong>Valor Total:</strong> R$ {parseFloat(a.valor_total || 0).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => verDetalhes(a.id)} 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Detalhes
                </button>
                {(a.status === 'ativo' || !a.status) && (
                  <>
                    <button 
                      onClick={() => handleEditar(a)} 
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => finalizarAluguel(a.id)} 
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Finalizar
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleExcluir(a.id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}