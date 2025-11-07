import React, { useState, useEffect } from "react";

export default function FormClientes({ onSave, editar }) {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => { if (editar) setForm(editar); }, [editar]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        editar ? `http://localhost:5000/api/clientes/${editar.id}` : "http://localhost:5000/api/clientes",
        { method: editar ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
      );
      if (!res.ok) throw new Error("Erro ao salvar cliente");
      setMensagem({ tipo: "success", texto: editar ? "Cliente atualizado!" : "Cliente cadastrado!" });
      setForm({ nome: "", telefone: "", email: "" });
      onSave();
    } catch (err) {
      setMensagem({ tipo: "error", texto: err.message });
    }
    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2 bg-gray-100 rounded shadow-md">
      {mensagem && (
        <div className={`p-2 rounded ${mensagem.tipo === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {mensagem.texto}
        </div>
      )}
      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required className="border p-1 rounded w-full" />
      <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="border p-1 rounded w-full" />
      <input name="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="border p-1 rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {editar ? "Salvar edição" : "Salvar"}
      </button>
    </form>
  );
}
