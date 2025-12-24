import React, { useState, useEffect } from "react";
import api from '../../services/api.js';

// Função para gerar código automático
// const gerarCodigoProduto = () => {
//   const timestamp = new Date().getTime().toString().slice(-6);
//   const random = Math.random().toString(36).substring(2, 5).toUpperCase();
//   return `P-${timestamp}${random}`;
// };

// Validação do formulário
const validarProduto = ({ codigo, nome, preco_aluguel, estoque }) => {
  if (!codigo || !nome) return "Código e nome são obrigatórios!";
  if (preco_aluguel < 0) return "O preço não pode ser negativo!";
  if (estoque < 0) return "O estoque não pode ser negativo!";
  return null;
};

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
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!editar) setForm((prev) => ({ ...prev, codigo: "" }));
  }, [editar]);

  useEffect(() => {
    if (editar) setForm({ ...editar });
  }, [editar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarProduto({
      ...form,
      preco_aluguel: parseFloat(form.preco_aluguel) || 0,
      estoque: parseInt(form.estoque) || 0,
    });

    if (erro) {
      setMensagem({ tipo: "error", texto: erro });
      return;
    }

    setEnviando(true);

    try {
      if (editar) {
        await api.put(`/produtos/${editar.id}`, {
          ...form,
          preco_aluguel: parseFloat(form.preco_aluguel) || 0,
          estoque: parseInt(form.estoque) || 0,
        });
      } else {
        await api.post("/produtos", {
          ...form,
          preco_aluguel: parseFloat(form.preco_aluguel) || 0,
          estoque: parseInt(form.estoque) || 0,
        });
      }

      setMensagem({ 
        tipo: "success", 
        texto: editar ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!" 
      });
      
      if (!editar) {
        setForm({ 
          codigo: "", 
          nome: "", 
          tamanho: "", 
          cor: "", 
          preco_aluguel: "", 
          estoque: 0 
        });
      }
      
      setTimeout(() => {
        onSave();
        setMensagem(null);
      }, 1500);
      
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setMensagem({ 
        tipo: "error", 
        texto: err.response?.data?.message || err.message || "Erro ao salvar produto" 
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md border">
      {mensagem && (
        <div className={`p-3 rounded-lg ${mensagem.tipo === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {mensagem.texto}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Código *</label>
          <input 
            name="codigo" 
            value={form.codigo} 
            onChange={handleChange} 
            required 
            className="border p-2 rounded w-full font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-600"
            placeholder="Código do produto"
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Nome *</label>
          <input 
            name="nome" 
            value={form.nome} 
            onChange={handleChange} 
            required 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-600"
            placeholder="Nome do produto"
            style={{ color: 'black' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Tamanho</label>
          <input 
            name="tamanho" 
            value={form.tamanho} 
            onChange={handleChange} 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-600"
            placeholder="Ex: P, M, G, GG"
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Cor</label>
          <input 
            name="cor" 
            value={form.cor} 
            onChange={handleChange} 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-600"
            placeholder="Ex: Vermelho, Azul, Preto"
            style={{ color: 'black' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Estoque</label>
          <input 
            name="estoque" 
            type="number" 
            min="0" 
            value={form.estoque} 
            onChange={handleChange} 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-600"
            placeholder="Quantidade em estoque"
            style={{ color: 'black' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Preço do Aluguel (R$)</label>
        <input 
          name="preco_aluguel" 
          type="number" 
          step="0.01" 
          min="0" 
          value={form.preco_aluguel} 
          onChange={handleChange} 
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-600"
          placeholder="0.00"
          style={{ color: 'black' }}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={enviando} 
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${enviando ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {enviando ? "Salvando..." : (editar ? "Atualizar Produto" : "Cadastrar Produto")}
        </button>
      </div>
    </form>
  );
}