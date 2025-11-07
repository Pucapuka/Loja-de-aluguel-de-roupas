import React, { useState, useEffect } from "react";

export default function FormAlugueis({ onSave, editar }) {
  const [form, setForm] = useState({
    roupa_id: "",
    cliente_id: "",
    data_inicio: "",
    data_fim: "",
    valor_total: "",
  });
  const [clientes, setClientes] = useState([]);
  const [roupas, setRoupas] = useState([]);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const resC = await fetch("http://localhost:5000/api/clientes");
      const resR = await fetch("http://localhost:5000/api/roupas");
      setClientes(await resC.json());
      setRoupas(await resR.json());
    };
    carregar();
  }, []);

  useEffect(() => { if (editar) setForm(editar); }, [editar]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roupa = roupas.find(r => r.id === parseInt(form.roupa_id));
    if (!roupa) { setMensagem({ tipo:"error", texto:"Roupa inválida!" }); return; }
    if (roupa.status !== "disponível") { setMensagem({ tipo:"error", texto:"Roupa não disponível!" }); return; }

    try {
      const res = await fetch(
        editar ? `http://localhost:5000/api/alugueis/${editar.id}` : "http://localhost:5000/api/alugueis",
        { method: editar ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
      );
      if (!res.ok) throw new Error("Erro ao registrar aluguel");

      // Atualiza status da roupa
      await fetch(`http://localhost:5000/api/roupas/${form.roupa_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...roupa, status: "alugado" }),
      });

      setMensagem({ tipo: "success", texto: editar ? "Aluguel atualizado!" : "Aluguel registrado!" });
      setForm({ roupa_id: "", cliente_id: "", data_inicio: "", data_fim: "", valor_total: "" });
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
      <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required className="border p-1 rounded w-full">
        <option value="">Selecione o cliente</option>
        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <select name="roupa_id" value={form.roupa_id} onChange={handleChange} required className="border p-1 rounded w-full">
        <option value="">Selecione a roupa</option>
        {roupas.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
      </select>
      <input type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} required className="border p-1 rounded w-full" />
      <input type="date" name="data_fim" value={form.data_fim} onChange={handleChange} required className="border p-1 rounded w-full" />
      <input type="number" name="valor_total" placeholder="Valor total" value={form.valor_total} onChange={handleChange} className="border p-1 rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editar ? "Salvar edição" : "Registrar aluguel"}</button>
    </form>
  );
}
