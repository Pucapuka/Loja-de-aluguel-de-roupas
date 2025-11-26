import React, { useState, useEffect } from "react";

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
    const carregar = async () => {
      const resC = await fetch("http://localhost:5000/api/clientes");
      const resR = await fetch("http://localhost:5000/api/produtos");
      setClientes(await resC.json());
      setProdutos(await resR.json());
    };
    carregar();
  }, []);

  useEffect(() => {
    if (editar) {
      setForm({
        cliente_id: editar.cliente_id,
        data_inicio: editar.data_inicio,
        data_fim: editar.data_fim
      });
      setAluguelId(editar.id);
      // Carregar itens e pagamentos do aluguel em edição
      carregarItensAluguel(editar.id);
      carregarPagamentosAluguel(editar.id);
    }
  }, [editar]);

  const carregarItensAluguel = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alugueis/${id}`);
      const aluguelData = await res.json();
      setItens(aluguelData.filter(item => item.item_id).map(item => ({
        produto_id: item.produto_id,
        produto_nome: item.produto_nome,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        total_parcial: item.total_parcial
      })));
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
    }
  };

  const carregarPagamentosAluguel = async (id) => {
  try {
    console.log(`🔄 Carregando pagamentos para aluguel ${id}...`);
    // Rota correta: /api/pagamentos/aluguel/:aluguel_id
    const res = await fetch(`http://localhost:5000/api/pagamentos/aluguel/${id}`);

    if (!res.ok) {
      console.warn(`Nenhum pagamento encontrado ou erro (${res.status})`);
      setPagamentos([]);
      return;
    }

    const pagamentosData = await res.json();
    console.log(`✅ ${pagamentosData.length} pagamentos carregados:`, pagamentosData);
    setPagamentos(pagamentosData);
  } catch (err) {
    console.error("❌ Erro ao carregar pagamentos:", err);
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
      return;
    }

    // Verificar se há estoque disponível
    if (produtoSelecionado.estoque < quantidade) {
      setMensagem({ tipo: "error", texto: "Estoque insuficiente!" });
      return;
    }

    const novoItem = {
      produto_id: produtoSelecionado.id,
      produto_nome: produtoSelecionado.nome,
      quantidade: quantidade,
      valor_unitario: produtoSelecionado.preco_aluguel,
      total_parcial: quantidade * produtoSelecionado.preco_aluguel
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
  
  console.log('🔄 Iniciando submit do aluguel...');
  console.log('📦 Itens:', itens);
  console.log('💰 Pagamentos:', pagamentos);
  console.log('🎯 Modo edição:', !!editar);
  
  if (itens.length === 0) {
    setMensagem({ tipo: "error", texto: "Adicione pelo menos um item!" });
    return;
  }

  if (Math.abs(diferenca) > 0.01) {
    setMensagem({ tipo: "error", texto: `Valor dos pagamentos (R$ ${valorTotalPagamentos.toFixed(2)}) não corresponde ao total do aluguel (R$ ${valorTotalItens.toFixed(2)})` });
    return;
  }

  try {
    let aluguelIdAtual = aluguelId;

    // Se é um novo aluguel, cria o cabeçalho primeiro
    if (!aluguelIdAtual) {
      console.log('🆕 Criando novo aluguel...');
      const resAluguel = await fetch("http://localhost:5000/api/alugueis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!resAluguel.ok) throw new Error("Erro ao criar aluguel");
      const data = await resAluguel.json();
      aluguelIdAtual = data.id;
      setAluguelId(aluguelIdAtual);
      console.log(`✅ Aluguel criado com ID: ${aluguelIdAtual}`);
    } else {
      console.log('📝 Editando aluguel existente...');
    }

    // Adiciona os itens (apenas se for novo aluguel)
    if (!editar) {
      console.log(`📦 Adicionando ${itens.length} itens...`);
      for (const item of itens) {
        const resItem = await fetch("http://localhost:5000/api/alugueis/itens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aluguel_id: aluguelIdAtual,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario
          })
        });

        if (!resItem.ok) {
          const errorText = await resItem.text();
          throw new Error(`Erro ao adicionar item: ${resItem.status} - ${errorText}`);
        }
        console.log(`✅ Item ${item.produto_nome} adicionado`);

        // Atualiza estoque do produto
        const produto = produtos.find(p => p.id === item.produto_id);
        if (produto) {
          await fetch(`http://localhost:5000/api/produtos/${item.produto_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...produto,
              estoque: produto.estoque - item.quantidade
            }),
          });
        }
      }
    }

    // CORREÇÃO: Lógica para pagamentos na edição
    console.log(`💰 Processando ${pagamentos.length} pagamentos...`);
    
      if (editar && aluguelIdAtual) {
      // MODO EDIÇÃO: Primeiro remove pagamentos antigos, depois adiciona os novos
      console.log('🔄 Modo edição - sincronizando pagamentos...');
      
      try {
        // 1. Buscar pagamentos existentes
          const resPagamentosExistentes = await fetch(`http://localhost:5000/api/pagamentos/aluguel/${aluguelIdAtual}`);
        if (resPagamentosExistentes.ok) {
          const pagamentosExistentes = await resPagamentosExistentes.json();
          console.log(`🗑️ Removendo ${pagamentosExistentes.length} pagamentos antigos...`);
          
          // 2. Remover pagamentos antigos (usando a NOVA rota)
          for (const pagamentoAntigo of pagamentosExistentes) {
            const resDelete = await fetch(`http://localhost:5000/api/pagamentos/${pagamentoAntigo.id}`, { // ✅ NOVA ROTA
              method: "DELETE"
            });
            
            if (!resDelete.ok) {
              console.warn(`⚠️ Erro ao remover pagamento ${pagamentoAntigo.id}: ${resDelete.status}`);
            } else {
              console.log(`✅ Pagamento ${pagamentoAntigo.id} removido`);
            }
          }
        } else {
          console.log('ℹ️ Nenhum pagamento existente para remover');
        }
      } catch (err) {
        console.warn('⚠️ Erro ao sincronizar pagamentos antigos:', err.message);
      }
    }

    // 3. Adicionar os novos pagamentos (tanto para novo quanto para edição)
    if (pagamentos.length > 0) {
      for (const pagamento of pagamentos) {
        console.log('💳 Enviando pagamento:', pagamento);
        // Rota correta: POST /api/pagamentos (body deve conter aluguel_id)
        const resPagamento = await fetch(`http://localhost:5000/api/pagamentos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...pagamento, aluguel_id: aluguelIdAtual })
        });

        if (!resPagamento.ok) {
          const errorText = await resPagamento.text();
          console.warn(`⚠️ Erro ao adicionar pagamento: ${errorText}`);
        } else {
          console.log(`✅ Pagamento de R$ ${pagamento.valor} adicionado`);
        }
      }
    } else {
      console.log('ℹ️ Nenhum pagamento para adicionar');
    }

    setMensagem({ tipo: "success", texto: editar ? "Aluguel atualizado!" : "Aluguel registrado!" });
    
    // Só limpa se for um novo aluguel
    if (!editar) {
      setForm({ cliente_id: "", data_inicio: "", data_fim: "" });
      setItens([]);
      setPagamentos([]);
      setAluguelId(null);
      setMostrarPagamentos(false);
    }
    
    onSave();
    console.log('🎉 Aluguel processado com sucesso!');
    
  } catch (err) {
    console.error("❌ Erro no submit:", err);
    setMensagem({ tipo: "error", texto: err.message });
  }
  
  setTimeout(() => setMensagem(null), 3000);
};

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-100 rounded shadow-md">
      {mensagem && (
        <div className={`p-2 rounded ${mensagem.tipo === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required className="border p-2 rounded w-full">
          <option value="">Selecione o cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        
        <input type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} required className="border p-2 rounded w-full" />
        <input type="date" name="data_fim" value={form.data_fim} onChange={handleChange} required className="border p-2 rounded w-full" />
      </div>

      {/* Seção de adicionar itens */}
      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">Adicionar Itens</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select value={produtoSelecionado?.id || ""} onChange={handleSelecionarProduto} className="border p-2 rounded">
            <option value="">Selecione o produto</option>
            {produtos.filter(p => p.estoque > 0).map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} - R$ {p.preco_aluguel} (Estoque: {p.estoque})
              </option>
            ))}
          </select>
          
          <input 
            type="number" 
            value={quantidade} 
            onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)} 
            min="1"
            className="border p-2 rounded"
            placeholder="Qtd"
          />
          
          <div className="p-2 bg-white rounded border">
            {produtoSelecionado ? `R$ ${(produtoSelecionado.preco_aluguel * quantidade).toFixed(2)}` : "R$ 0.00"}
          </div>
          
          <button type="button" onClick={adicionarItem} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de itens adicionados */}
      {itens.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Itens do Aluguel</h3>
          <div className="space-y-2">
            {itens.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                <span>{item.produto_nome} - {item.quantidade} x R$ {item.valor_unitario}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold">R$ {item.total_parcial.toFixed(2)}</span>
                  <button 
                    type="button" 
                    onClick={() => removerItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center p-2 bg-blue-100 rounded border font-bold">
              <span>TOTAL DOS ITENS</span>
              <span>R$ {valorTotalItens.toFixed(2)}</span>
            </div>
          </div>

          {/* Seção de pagamentos */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Pagamentos</h3>
              <button 
                type="button"
                onClick={() => setMostrarPagamentos(!mostrarPagamentos)}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
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
                      className="border p-2 rounded"
                    />
                    <select
                      value={pagamento.forma_pagamento}
                      onChange={(e) => atualizarPagamento(index, 'forma_pagamento', e.target.value)}
                      className="border p-2 rounded"
                    >
                      {formasPagamento.map(forma => (
                        <option key={forma} value={forma}>{forma}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={pagamento.data_vencimento}
                      onChange={(e) => atualizarPagamento(index, 'data_vencimento', e.target.value)}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      value={pagamento.observacao}
                      onChange={(e) => atualizarPagamento(index, 'observacao', e.target.value)}
                      placeholder="Observação"
                      className="border p-2 rounded"
                    />
                    <div className="text-center font-bold">
                      R$ {(pagamento.valor || 0).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removerPagamento(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={adicionarPagamento}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                  + Adicionar Pagamento
                </button>

                {/* Resumo dos pagamentos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-100 rounded border">
                  <div>
                    <strong>Total Itens:</strong> R$ {valorTotalItens.toFixed(2)}
                  </div>
                  <div>
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
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        disabled={itens.length === 0 || (mostrarPagamentos && Math.abs(diferenca) > 0.01)}
      >
        {editar ? "Salvar edição" : "Registrar aluguel"}
      </button>
    </form>
  );
}