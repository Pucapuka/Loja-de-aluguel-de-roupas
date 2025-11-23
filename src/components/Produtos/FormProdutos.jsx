import React, { useState, useEffect } from "react";

export default function FormProdutos({ onSave, editar }) {
  const [form, setForm] = useState({
    codigo: "",
    nome: "",
    tamanho: "",
    cor: "",
    preco_aluguel: "",
    estoque: 0,
  });
  const [mensagem, setMensagem] = useState(null);

  // Gerar código automático se for novo produto
  useEffect(() => {
    if (!editar && !form.codigo) {
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      setForm(prev => ({ ...prev, codigo: `P-${timestamp}${random}` }));
    }
  }, [editar]);

  useEffect(() => {
    if (editar) {
      setForm({
        codigo: editar.codigo || "",
        nome: editar.nome || "",
        tamanho: editar.tamanho || "",
        cor: editar.cor || "",
        preco_aluguel: editar.preco_aluguel || "",
        estoque: editar.estoque || 0,
      });
    }
  }, [editar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.codigo || !form.nome) {
      setMensagem({ tipo: "error", texto: "Código e nome são obrigatórios!" });
      return;
    }

    try {
      const res = await fetch(
        editar ? `http://localhost:5000/api/produtos/${editar.id}` : "http://localhost:5000/api/produtos",
        {
          method: editar ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            preco_aluguel: parseFloat(form.preco_aluguel) || 0,
            estoque: parseInt(form.estoque) || 0
          }),
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar produto");
      }

      setMensagem({ 
        tipo: "success", 
        texto: editar ? "Produto atualizado!" : "Produto cadastrado!" 
      });
      setForm({ 
        codigo: "", 
        nome: "", 
        tamanho: "", 
        cor: "", 
        preco_aluguel: "", 
        estoque: 0 
      });
      onSave();
    } catch (err) {
      setMensagem({ tipo: "error", texto: err.message });
    }
    setTimeout(() => setMensagem(null), 3000);
  };

  const tamanhos = ["PP", "P", "M", "G", "GG", "XG", "Único"];

  return (
    <form id="form-produtos" onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md border">
      {mensagem && (
        <div className={`p-3 rounded-lg ${
          mensagem.tipo === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {mensagem.texto}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código do Produto *
          </label>
          <input 
            name="codigo" 
            placeholder="P-000001"
            value={form.codigo} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input 
            name="nome" 
            placeholder="Ex: Vestido Longo, Terno Social, etc." 
            value={form.nome} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho
          </label>
          <select 
            name="tamanho" 
            value={form.tamanho} 
            onChange={handleChange} 
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione o tamanho</option>
            {tamanhos.map(tamanho => (
              <option key={tamanho} value={tamanho}>{tamanho}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor
          </label>
          <input 
            name="cor" 
            value={form.cor} 
            onChange={handleChange} 
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estoque
          </label>
          <input 
            name="estoque" 
            type="number" 
            min="0"
            placeholder="0" 
            value={form.estoque} 
            onChange={handleChange} 
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preço do Aluguel (R$)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">R$</span>
          <input 
            name="preco_aluguel" 
            type="number" 
            step="0.01"
            min="0"
            placeholder="0.00" 
            value={form.preco_aluguel} 
            onChange={handleChange} 
            className="border border-gray-300 p-2 pl-10 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>
    </form>
  );
}