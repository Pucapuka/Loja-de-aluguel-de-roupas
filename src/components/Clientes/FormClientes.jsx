import React, { useState, useEffect } from "react";

export default function FormClientes({ onSave, editar }) {
  const [form, setForm] = useState({ 
    nome: "", 
    telefone: "", 
    email: "", 
    endereco: "" 
  });
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => { 
    if (editar) {
      setForm({
        nome: editar.nome || "",
        telefone: editar.telefone || "",
        email: editar.email || "",
        endereco: editar.endereco || ""
      });
    }
  }, [editar]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        editar ? `http://localhost:5000/api/clientes/${editar.id}` : "http://localhost:5000/api/clientes",
        { 
          method: editar ? "PUT" : "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify(form) 
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar cliente");
      }
      
      setMensagem({ 
        tipo: "success", 
        texto: editar ? "Cliente atualizado!" : "Cliente cadastrado!" 
      });
      setForm({ nome: "", telefone: "", email: "", endereco: "" });
      onSave();
    } catch (err) {
      setMensagem({ tipo: "error", texto: err.message });
    }
    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-gray-100 rounded shadow-md">
      {mensagem && (
        <div className={`p-2 rounded ${mensagem.tipo === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {mensagem.texto}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input 
            name="nome" 
            placeholder="Nome completo" 
            value={form.nome} 
            onChange={handleChange} 
            required 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input 
            name="telefone" 
            placeholder="(00) 00000-0000" 
            value={form.telefone} 
            onChange={handleChange} 
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input 
          name="email" 
          type="email"
          placeholder="email@exemplo.com" 
          value={form.email} 
          onChange={handleChange} 
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <textarea 
          name="endereco" 
          placeholder="Endereço completo" 
          value={form.endereco} 
          onChange={handleChange} 
          rows="3"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
        />
      </div>

      <button 
        type="submit" 
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors w-full md:w-auto"
      >
        {editar ? "Salvar edição" : "Cadastrar cliente"}
      </button>
    </form>
  );
}