import React, { useState, useEffect } from "react";
import api from '../../services/api.js';

export default function FormAlugueis({ onSave, editar }) {
  const [form, setForm] = useState({
    cliente_id: "",
    data_inicio: "",
    data_fim: ""
  });
  const [itens, setItens] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [aluguelId, setAluguelId] = useState(null);
  const [mostrarPagamentos, setMostrarPagamentos] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formas de pagamento disponíveis
  const formasPagamento = [
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito", 
    "PIX",
    "Transferência Bancária",
    "Fiado",
    "Outro"
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resClientes, resProdutos] = await Promise.all([
          api.get("/clientes"),
          api.get("/produtos")
        ]);
        
        // Garantir que sejam arrays
        let dadosClientes = resClientes.data;
        if (dadosClientes && dadosClientes.data && Array.isArray(dadosClientes.data)) {
          dadosClientes = dadosClientes.data;
        }
        if (!Array.isArray(dadosClientes)) dadosClientes = [];
        
        let dadosProdutos = resProdutos.data;
        if (dadosProdutos && dadosProdutos.data && Array.isArray(dadosProdutos.data)) {
          dadosProdutos = dadosProdutos.data;
        }
        if (!Array.isArray(dadosProdutos)) dadosProdutos = [];
        
        setClientes(dadosClientes);
        setProdutos(dadosProdutos);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setMensagem({ tipo: "error", texto: "Erro ao carregar clientes/produtos" });
      }
    };
    
    carregarDados();
  }, []);

  useEffect(() => {
    if (editar) {
      setForm({
        cliente_id: editar.cliente_id || "",
        data_inicio: editar.data_inicio || "",
        data_fim: editar.data_fim || ""
      });
      setAluguelId(editar.id);
      // Carregar itens e pagamentos do aluguel em edição
      carregarItensAluguel(editar.id);
      carregarPagamentosAluguel(editar.id);
    }
  }, [editar]);

  const carregarItensAluguel = async (id) => {
    try {
      const response = await api.get(`/alugueis/${id}`);
      let dados = response.data;
      if (dados && dados.data && Array.isArray(dados.data)) {
        dados = dados.data;
      }
      
      if (Array.isArray(dados)) {
        const itensAluguel = dados.filter(item => item.item_id).map(item => ({
          produto_id: item.produto_id,
          produto_nome: item.produto_nome,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          total_parcial: item.total_parcial
        }));
        setItens(itensAluguel);
      }
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
    }
  };

  const carregarPagamentosAluguel = async (id) => {
    try {
      const response = await api.get(`/pagamentos/aluguel/${id}`);
      let dados = response.data;
      if (dados && dados.data && Array.isArray(dados.data)) {
        dados = dados.data;
      }
      
      if (!Array.isArray(dados)) {
        console.warn('Dados de pagamentos não são um array:', dados);
        dados = [];
      }
      
      setPagamentos(dados);
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
      setMensagem({ tipo: "error", texto: `Erro ao carregar pagamentos: ${err.message}` });
      setPagamentos([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "cliente_id") {
      const cliente = clientes.find(c => c.id === parseInt(value));
      setClienteSelecionado(cliente);
    }
  };

  const handleSelecionarProduto = (e) => {
    const produtoId = parseInt(e.target.value);
    const produto = produtos.find(p => p.id === produtoId);
    setProdutoSelecionado(produto);
  };

  const adicionarItem = () => {
    if (!produtoSelecionado) {
      setMensagem({ tipo: "error", texto: "Selecione um produto!" });
      setTimeout(() => setMensagem(null), 2000);
      return;
    }

    // Verificar se há estoque disponível
    if (produtoSelecionado.estoque < quantidade) {
      setMensagem({ tipo: "error", texto: "Estoque insuficiente!" });
      setTimeout(() => setMensagem(null), 2000);
      return;
    }

    const novoItem = {
      produto_id: produtoSelecionado.id,
      produto_nome: produtoSelecionado.nome,
      quantidade: quantidade,
      valor_unitario: produtoSelecionado.preco_aluguel || produtoSelecionado.preco || 0,
      total_parcial: quantidade * (produtoSelecionado.preco_aluguel || produtoSelecionado.preco || 0)
    };

    setItens([...itens, novoItem]);
    setProdutoSelecionado(null);
    setQuantidade(1);
    setMensagem({ tipo: "success", texto: "Item adicionado!" });
    setTimeout(() => setMensagem(null), 2000);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  // Funções para gerenciar pagamentos
  const adicionarPagamento = () => {
    const novoPagamento = {
      valor: 0,
      forma_pagamento: "Dinheiro",
      data_vencimento: new Date().toISOString().split('T')[0],
      observacao: ""
    };
    setPagamentos([...pagamentos, novoPagamento]);
  };

  const atualizarPagamento = (index, campo, valor) => {
    const novosPagamentos = [...pagamentos];
    novosPagamentos[index][campo] = valor;
    setPagamentos(novosPagamentos);
  };

  const removerPagamento = (index) => {
    const novosPagamentos = pagamentos.filter((_, i) => i !== index);
    setPagamentos(novosPagamentos);
  };

  const valorTotalItens = itens.reduce((total, item) => total + item.total_parcial, 0);
  const valorTotalPagamentos = pagamentos.reduce((total, pagamento) => total + (parseFloat(pagamento.valor) || 0), 0);
  const diferenca = valorTotalItens - valorTotalPagamentos;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (itens.length === 0) {
      setMensagem({ tipo: "error", texto: "Adicione pelo menos um item!" });
      setLoading(false);
      return;
    }

    if (mostrarPagamentos && Math.abs(diferenca) > 0.01) {
      setMensagem({ tipo: "error", texto: `Valor dos pagamentos (R$ ${valorTotalPagamentos.toFixed(2)}) não corresponde ao total do aluguel (R$ ${valorTotalItens.toFixed(2)})` });
      setLoading(false);
      return;
    }

    try {
      let aluguelIdAtual = aluguelId;

      // Se é um novo aluguel, cria o cabeçalho primeiro
      if (!aluguelIdAtual) {
        const resAluguel = await api.post("/alugueis", form);
        aluguelIdAtual = resAluguel.data.id || resAluguel.data;
        setAluguelId(aluguelIdAtual);
      } else {
        // Se estiver editando, atualiza o aluguel
        await api.put(`/alugueis/${aluguelIdAtual}`, form);
      }

      // Adiciona os itens (apenas se for novo aluguel)
      if (!editar) {
        for (const item of itens) {
          await api.post("/alugueis/itens", {
            aluguel_id: aluguelIdAtual,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario
          });

          // Atualiza estoque do produto
          const produto = produtos.find(p => p.id === item.produto_id);
          if (produto) {
            await api.put(`/produtos/${item.produto_id}`, { 
              ...produto,
              estoque: produto.estoque - item.quantidade
            });
          }
        }
      }

      // Lógica para pagamentos
      if (editar && aluguelIdAtual) {
        // Buscar pagamentos existentes
        try {
          const resPagamentosExistentes = await api.get(`/pagamentos/aluguel/${aluguelIdAtual}`);
          let pagamentosExistentes = resPagamentosExistentes.data;
          if (pagamentosExistentes && pagamentosExistentes.data && Array.isArray(pagamentosExistentes.data)) {
            pagamentosExistentes = pagamentosExistentes.data;
          }
          
          // Remover pagamentos antigos
          for (const pagamentoAntigo of pagamentosExistentes) {
            await api.delete(`/pagamentos/${pagamentoAntigo.id}`);
          }
        } catch (err) {
          console.warn('Erro ao sincronizar pagamentos antigos:', err.message);
        }
      }

      // Adicionar os novos pagamentos
      if (pagamentos.length > 0) {
        for (const pagamento of pagamentos) {
          if (pagamento.valor > 0) {
            await api.post("/pagamentos", { 
              ...pagamento, 
              aluguel_id: aluguelIdAtual 
            });
          }
        }
      }

      setMensagem({ 
        tipo: "success", 
        texto: editar ? "Aluguel atualizado com sucesso!" : "Aluguel registrado com sucesso!" 
      });
      
      // Só limpa se for um novo aluguel
      if (!editar) {
        setForm({ cliente_id: "", data_inicio: "", data_fim: "" });
        setItens([]);
        setPagamentos([]);
        setAluguelId(null);
        setMostrarPagamentos(false);
      }
      
      setTimeout(() => {
        onSave();
        setMensagem(null);
      }, 1500);
      
    } catch (err) {
      console.error("Erro no submit:", err);
      setMensagem({ 
        tipo: "error", 
        texto: err.response?.data?.message || err.message || "Erro ao processar aluguel" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-100 rounded shadow-md">
      {mensagem && (
        <div className={`p-2 rounded ${mensagem.tipo === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select 
          name="cliente_id" 
          value={form.cliente_id} 
          onChange={handleChange} 
          required 
          className="border p-2 rounded w-full text-gray-800 placeholder:text-gray-600"
          style={{ color: 'black' }}
        >
          <option value="" className="text-gray-600">Selecione o cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id} className="text-gray-800">
              {c.nome}
            </option>
          ))}
        </select>
        
        <input 
          type="date" 
          name="data_inicio" 
          value={form.data_inicio} 
          onChange={handleChange} 
          required 
          className="border p-2 rounded w-full text-gray-800"
          style={{ color: 'black' }}
        />
        <input 
          type="date" 
          name="data_fim" 
          value={form.data_fim} 
          onChange={handleChange} 
          required 
          className="border p-2 rounded w-full text-gray-800"
          style={{ color: 'black' }}
        />
      </div>

      {/* Seção de adicionar itens */}
      <div className="border-t pt-4">
        <h3 className="font-bold mb-2 text-gray-800">Adicionar Itens</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select 
            value={produtoSelecionado?.id || ""} 
            onChange={handleSelecionarProduto} 
            className="border p-2 rounded text-gray-800"
            style={{ color: 'black' }}
          >
            <option value="" className="text-gray-600">Selecione o produto</option>
            {produtos.filter(p => p.estoque > 0).map(p => (
              <option key={p.id} value={p.id} className="text-gray-800">
                {p.nome} - R$ {p.preco_aluguel || p.preco || 0} (Estoque: {p.estoque})
              </option>
            ))}
          </select>
          
          <input 
            type="number" 
            value={quantidade} 
            onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)} 
            min="1"
            className="border p-2 rounded text-gray-800"
            style={{ color: 'black' }}
            placeholder="Qtd"
          />
          
          <div className="p-2 bg-white rounded border text-gray-800">
            {produtoSelecionado ? `R$ ${((produtoSelecionado.preco_aluguel || produtoSelecionado.preco || 0) * quantidade).toFixed(2)}` : "R$ 0.00"}
          </div>
          
          <button 
            type="button" 
            onClick={adicionarItem} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de itens adicionados */}
      {itens.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2 text-gray-800">Itens do Aluguel</h3>
          <div className="space-y-2">
            {itens.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="text-gray-800">{item.produto_nome} - {item.quantidade} x R$ {item.valor_unitario.toFixed(2)}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-800">R$ {item.total_parcial.toFixed(2)}</span>
                  <button 
                    type="button" 
                    onClick={() => removerItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center p-2 bg-blue-100 rounded border font-bold">
              <span className="text-gray-800">TOTAL DOS ITENS</span>
              <span className="text-gray-800">R$ {valorTotalItens.toFixed(2)}</span>
            </div>
          </div>

          {/* Seção de pagamentos */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800">Pagamentos</h3>
              <button 
                type="button"
                onClick={() => setMostrarPagamentos(!mostrarPagamentos)}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm transition-colors"
              >
                {mostrarPagamentos ? "Ocultar" : "Gerenciar Pagamentos"}
              </button>
            </div>

            {mostrarPagamentos && (
              <div className="space-y-3">
                {pagamentos.map((pagamento, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center p-3 bg-white rounded border">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={pagamento.valor}
                      onChange={(e) => atualizarPagamento(index, 'valor', parseFloat(e.target.value) || 0)}
                      placeholder="Valor"
                      className="border p-2 rounded text-gray-800"
                      style={{ color: 'black' }}
                    />
                    <select
                      value={pagamento.forma_pagamento}
                      onChange={(e) => atualizarPagamento(index, 'forma_pagamento', e.target.value)}
                      className="border p-2 rounded text-gray-800"
                      style={{ color: 'black' }}
                    >
                      {formasPagamento.map(forma => (
                        <option key={forma} value={forma} className="text-gray-800">{forma}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={pagamento.data_vencimento}
                      onChange={(e) => atualizarPagamento(index, 'data_vencimento', e.target.value)}
                      className="border p-2 rounded text-gray-800"
                      style={{ color: 'black' }}
                    />
                    <input
                      type="text"
                      value={pagamento.observacao}
                      onChange={(e) => atualizarPagamento(index, 'observacao', e.target.value)}
                      placeholder="Observação"
                      className="border p-2 rounded text-gray-800"
                      style={{ color: 'black' }}
                    />
                    <div className="text-center font-bold text-gray-800">
                      R$ {(pagamento.valor || 0).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removerPagamento(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={adicionarPagamento}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition-colors"
                >
                  + Adicionar Pagamento
                </button>

                {/* Resumo dos pagamentos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-100 rounded border">
                  <div className="text-gray-800">
                    <strong>Total Itens:</strong> R$ {valorTotalItens.toFixed(2)}
                  </div>
                  <div className="text-gray-800">
                    <strong>Total Pagamentos:</strong> R$ {valorTotalPagamentos.toFixed(2)}
                  </div>
                  <div className={`font-bold ${diferenca === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <strong>Diferença:</strong> R$ {diferenca.toFixed(2)}
                  </div>
                </div>

                {diferenca !== 0 && (
                  <div className="p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                    ⚠️ A soma dos pagamentos deve ser igual ao total do aluguel
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button 
        type="submit" 
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={itens.length === 0 || (mostrarPagamentos && Math.abs(diferenca) > 0.01) || loading}
      >
        {loading ? "Processando..." : (editar ? "Salvar edição" : "Registrar aluguel")}
      </button>
    </form>
  );
}