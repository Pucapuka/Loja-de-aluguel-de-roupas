import React, { useEffect, useState } from "react";
import FormAlugueis from "./FormAlugueis.jsx";
import api from '../../services/api.js';

export default function ListaAlugueis() {
  const [alugueis, setAlugueis] = useState([]);
  const [editarAluguel, setEditarAluguel] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientesMap, setClientesMap] = useState({});
  const [produtosMap, setProdutosMap] = useState({});

  const carregarDadosAuxiliares = async () => {
    try {
      // Carrega clientes para mapeamento
      const resClientes = await api.get("/clientes");
      let clientesData = resClientes.data;
      if (clientesData && clientesData.data && Array.isArray(clientesData.data)) {
        clientesData = clientesData.data;
      }
      
      const clientesMapTemp = {};
      if (Array.isArray(clientesData)) {
        clientesData.forEach(cliente => {
          clientesMapTemp[cliente.id] = cliente.nome;
        });
      }
      setClientesMap(clientesMapTemp);

      // Carrega produtos para mapeamento
      const resProdutos = await api.get("/produtos");
      let produtosData = resProdutos.data;
      if (produtosData && produtosData.data && Array.isArray(produtosData.data)) {
        produtosData = produtosData.data;
      }
      
      const produtosMapTemp = {};
      if (Array.isArray(produtosData)) {
        produtosData.forEach(produto => {
          produtosMapTemp[produto.id] = produto.nome;
        });
      }
      setProdutosMap(produtosMapTemp);
    } catch (err) {
      console.warn("Erro ao carregar dados auxiliares:", err);
    }
  };

  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Buscando alugueis...");
      const response = await api.get("/alugueis");
      console.log('✅ Resposta da API:', response);
      
      // Verifica se a resposta tem dados
      let dados = response.data;

      // Se for um objeto com propriedade data, ajuste
      if (dados && dados.data && Array.isArray(dados.data)) {
        dados = dados.data;
      }

      // Garante que seja um array
      if (!Array.isArray(dados)) {
        console.warn('⚠️ Dados não são um array:', dados);
        dados = [];
      }

      // Formata os dados para exibição
      const alugueisFormatados = dados.map(aluguel => {
        // Busca o nome do cliente no mapa
        const nomeCliente = clientesMap[aluguel.cliente_id] || 
                           aluguel.cliente_nome || 
                           aluguel.cliente || 
                           `Cliente ${aluguel.cliente_id}`;
        
        // Busca o nome do produto no mapa (ou pega do primeiro item)
        let nomeProduto = produtosMap[aluguel.produto_id] || 
                         aluguel.produto_nome || 
                         aluguel.produto || 
                         `Produto ${aluguel.produto_id}`;
        
        // Se tiver itens, mostra o primeiro produto
        if (aluguel.itens && aluguel.itens.length > 0) {
          nomeProduto = aluguel.itens[0].produto_nome || nomeProduto;
          if (aluguel.itens.length > 1) {
            nomeProduto += ` +${aluguel.itens.length - 1}`;
          }
        }

        return {
          id: aluguel.id,
          cliente_id: aluguel.cliente_id,
          cliente: nomeCliente,
          produto: nomeProduto,
          data_inicio: aluguel.data_inicio || aluguel.dataInicio || aluguel.data_start,
          data_fim: aluguel.data_fim || aluguel.dataFim || aluguel.data_end,
          valor_total: aluguel.valor_total || aluguel.valorTotal || 0,
          status: aluguel.status || 'Ativo',
          itens: aluguel.itens || [],
          pagamentos: aluguel.pagamentos || []
        };
      });

      console.log(`📦 ${alugueisFormatados.length} alugueis carregados`);
      setAlugueis(alugueisFormatados);
    } catch (err) {
      console.error('❌ Erro ao carregar alugueis:', err);
      setError("Não foi possível carregar os aluguéis. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      await carregarDadosAuxiliares();
      await carregar();
    };
    inicializar();
  }, []);

  useEffect(() => {
    // Recarrega aluguéis quando os mapas de clientes/produtos forem atualizados
    if (Object.keys(clientesMap).length > 0 || Object.keys(produtosMap).length > 0) {
      carregar();
    }
  }, [clientesMap, produtosMap]);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este aluguel e todos os seus itens/pagamentos?")) return;
    try {
      await api.delete(`/alugueis/${id}`);
      carregar();
    } catch (err) {
      alert("Erro ao excluir aluguel: " + err.message);
    }
  };

  const handleEditar = (aluguel) => {
    setEditarAluguel(aluguel);
    setMostrarFormulario(true);
  };

  const handleSalvarEdicao = () => {
    setEditarAluguel(null);
    setMostrarFormulario(false);
    carregar();
  };

  const handleCancelarEdicao = () => {
    setEditarAluguel(null);
    setMostrarFormulario(false);
  };

  const handleNovoAluguel = () => {
    setEditarAluguel(null);
    setMostrarFormulario(true);
  };

  const handleCancelarNovo = () => {
    setMostrarFormulario(false);
    setEditarAluguel(null);
  };

  const handleDetalhes = (aluguel) => {
    // Você pode implementar um modal de detalhes aqui
    console.log("Detalhes do aluguel:", aluguel);
    alert(`Detalhes do Aluguel:\nCliente: ${aluguel.cliente}\nData Início: ${aluguel.data_inicio}\nData Fim: ${aluguel.data_fim}\nValor Total: R$ ${aluguel.valor_total?.toFixed(2) || '0.00'}`);
  };

  const alugueisFiltrados = alugueis.filter(a =>
    (a.cliente?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (a.produto?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (a.data_inicio || '').includes(filtro) ||
    (a.data_fim || '').includes(filtro)
  );

  // Formata data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  if (loading && alugueis.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Carregando aluguéis...</p>
      </div>
    );
  }

  if (error && alugueis.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Erro</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={carregar}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📑 Aluguéis</h2>
          <p className="text-gray-600 mt-1">
            {alugueis.length} aluguel{alugueis.length !== 1 ? 'éis' : 'el'} cadastrado{alugueis.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={handleNovoAluguel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          <span>Novo Aluguel</span>
        </button>
      </div>

      {(mostrarFormulario || editarAluguel) && (
        <div className="mb-6">
          <FormAlugueis 
            onSave={editarAluguel ? handleSalvarEdicao : () => { setMostrarFormulario(false); carregar(); }} 
            editar={editarAluguel}
          />
          <div className="mt-2 flex justify-end">
            <button 
              onClick={editarAluguel ? handleCancelarEdicao : handleCancelarNovo}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {editarAluguel && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            Editando aluguel de: <strong>{editarAluguel.cliente}</strong> (ID: {editarAluguel.id})
          </p>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Lista de Aluguéis
            </h3>
            <p className="text-sm text-gray-500">
              {alugueisFiltrados.length} de {alugueis.length} resultado{alugueisFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por cliente, produto ou data..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              style={{ color: 'black' }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {alugueisFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {alugueis.length === 0 ? "Nenhum aluguel cadastrado" : "Nenhum aluguel encontrado"}
              {filtro && (
                <button 
                  onClick={() => setFiltro("")}
                  className="mt-2 ml-2 text-blue-600 hover:text-blue-800"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto(s)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alugueisFiltrados.map((aluguel) => (
                  <tr key={aluguel.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{aluguel.cliente}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{aluguel.produto}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatarData(aluguel.data_inicio)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatarData(aluguel.data_fim)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      R$ {typeof aluguel.valor_total === 'number' ? aluguel.valor_total.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button 
                        onClick={() => handleDetalhes(aluguel)} 
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Detalhes
                      </button>
                      <button 
                        onClick={() => handleEditar(aluguel)} 
                        className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(aluguel.id)} 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Resumo */}
        {alugueisFiltrados.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600">
                Mostrando {alugueisFiltrados.length} de {alugueis.length} aluguel{alugueis.length !== 1 ? 'éis' : 'el'}
              </div>
              <div className="mt-2 md:mt-0 text-sm font-medium text-gray-800">
                Valor total filtrado: R$ {alugueisFiltrados.reduce((total, a) => total + (parseFloat(a.valor_total) || 0), 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}