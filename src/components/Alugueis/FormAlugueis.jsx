import React, { useState, useEffect } from "react";

export default function FormAlugueis({ onSave, editar }) {
  const [form, setForm] = useState({
    cliente_id: "",
    data_inicio: "",
    data_fim: ""
  });
  const [itens, setItens] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [roupaSelecionada, setRoupaSelecionada] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [roupas, setRoupas] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [aluguelId, setAluguelId] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const resC = await fetch("http://localhost:5000/api/clientes");
      const resR = await fetch("http://localhost:5000/api/roupas");
      setClientes(await resC.json());
      setRoupas(await resR.json());
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
      // Carregar itens do aluguel em edição
      carregarItensAluguel(editar.id);
    }
  }, [editar]);

  const carregarItensAluguel = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alugueis/${id}/itens`);
      const itensData = await res.json();
      setItens(itensData);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
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

  const handleSelecionarRoupa = (e) => {
    const roupaId = parseInt(e.target.value);
    const roupa = roupas.find(r => r.id === roupaId);
    setRoupaSelecionada(roupa);
  };

  const adicionarItem = () => {
    if (!roupaSelecionada) {
      setMensagem({ tipo: "error", texto: "Selecione uma roupa!" });
      return;
    }

    if (roupaSelecionada.status !== "disponível") {
      setMensagem({ tipo: "error", texto: "Roupa não disponível!" });
      return;
    }

    const novoItem = {
      roupa_id: roupaSelecionada.id,
      roupa_nome: roupaSelecionada.nome,
      quantidade: quantidade,
      valor_unitario: roupaSelecionada.preco_aluguel,
      total_parcial: quantidade * roupaSelecionada.preco_aluguel
    };

    setItens([...itens, novoItem]);
    setRoupaSelecionada(null);
    setQuantidade(1);
    setMensagem({ tipo: "success", texto: "Item adicionado!" });
    setTimeout(() => setMensagem(null), 2000);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (itens.length === 0) {
      setMensagem({ tipo: "error", texto: "Adicione pelo menos um item!" });
      return;
    }

    try {
      let aluguelIdAtual = aluguelId;

      // Se é um novo aluguel, cria o cabeçalho primeiro
      if (!aluguelIdAtual) {
        const resAluguel = await fetch("http://localhost:5000/api/alugueis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        if (!resAluguel.ok) throw new Error("Erro ao criar aluguel");
        const data = await resAluguel.json();
        aluguelIdAtual = data.id;
        setAluguelId(aluguelIdAtual);
      }

      // Adiciona os itens
      for (const item of itens) {
        const resItem = await fetch("http://localhost:5000/api/alugueis/itens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aluguel_id: aluguelIdAtual,
            roupa_id: item.roupa_id,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario
          })
        });

        if (!resItem.ok) throw new Error("Erro ao adicionar item");

        // Atualiza status da roupa
        await fetch(`http://localhost:5000/api/roupas/${item.roupa_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ...roupas.find(r => r.id === item.roupa_id), 
            status: "alugado" 
          }),
        });
      }

      setMensagem({ tipo: "success", texto: editar ? "Aluguel atualizado!" : "Aluguel registrado!" });
      setForm({ cliente_id: "", data_inicio: "", data_fim: "" });
      setItens([]);
      setAluguelId(null);
      onSave();
    } catch (err) {
      setMensagem({ tipo: "error", texto: err.message });
    }
    setTimeout(() => setMensagem(null), 3000);
  };

  const valorTotal = itens.reduce((total, item) => total + item.total_parcial, 0);

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
          <select value={roupaSelecionada?.id || ""} onChange={handleSelecionarRoupa} className="border p-2 rounded">
            <option value="">Selecione a roupa</option>
            {roupas.filter(r => r.status === "disponível").map(r => (
              <option key={r.id} value={r.id}>
                {r.nome} - R$ {r.preco_aluguel}
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
            {roupaSelecionada ? `R$ ${(roupaSelecionada.preco_aluguel * quantidade).toFixed(2)}` : "R$ 0.00"}
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
                <span>{item.roupa_nome} - {item.quantidade} x R$ {item.valor_unitario}</span>
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
              <span>TOTAL</span>
              <span>R$ {valorTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full">
        {editar ? "Salvar edição" : "Registrar aluguel"}
      </button>
    </form>
  );
}