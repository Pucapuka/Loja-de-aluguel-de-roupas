import React, { useState, useEffect } from "react";

export default function FormRoupas({ onSave, editar }) {
  const [form, setForm] = useState({
    nome: "",
    tamanho: "",
    cor: "",
    preco_aluguel: "",
    status: "disponível",
  });
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    if (editar) setForm(editar);
  }, [editar]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        editar ? `http://localhost:5000/api/roupas/${editar.id}` : "http://localhost:5000/api/roupas",
        {
          method: editar ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Erro ao salvar roupa");

      setMensagem({ tipo: "success", texto: editar ? "Roupa atualizada!" : "Roupa cadastrada!" });
      setForm({ nome: "", tamanho: "", cor: "", preco_aluguel: "", status: "disponível" });
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
      <input name="tamanho" placeholder="Tamanho" value={form.tamanho} onChange={handleChange} className="border p-1 rounded w-full" />
      <input name="cor" placeholder="Cor" value={form.cor} onChange={handleChange} className="border p-1 rounded w-full" />
      <input name="preco_aluguel" type="number" placeholder="Preço do aluguel" value={form.preco_aluguel} onChange={handleChange} className="border p-1 rounded w-full" />
      <select name="status" value={form.status} onChange={handleChange} className="border p-1 rounded w-full">
        <option value="disponível">Disponível</option>
        <option value="reservado">Reservado</option>
        <option value="alugado">Alugado</option>
        <option value="em manutenção">Em manutenção</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {editar ? "Salvar edição" : "Salvar"}
      </button>
    </form>
  );
}
