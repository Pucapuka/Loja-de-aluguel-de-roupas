import React, { useEffect, useState } from "react";
import FormRoupas from "./FormRoupas";

export default function ListaRoupas() {
  const [roupas, setRoupas] = useState([]);
  const [editarRoupas, setEditarRoupas] = useState(null);

  const carregar = async () => {
    const res = await fetch("http://localhost:5000/api/roupas");
    setRoupas(await res.json());
  };

  useEffect(() => { carregar(); }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta roupa?")) return;
    await fetch(`http://localhost:5000/api/roupas/${id}`, { method: "DELETE" });
    carregar();
  };

  const handleEditar = (r) => setEditarRoupas(r);
  const handleSalvarEdicao = () => { setEditarRoupas(null); carregar(); };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">👗 Roupas</h2>
      <FormRoupas onSave={editarRoupas ? handleSalvarEdicao : carregar} editar={editarRoupas} />
      <ul className="mt-4">
        {roupas.map((r) => (
          <li key={r.id} className="flex justify-between items-center p-2 border-b">
            <span>{r.nome} — {r.tamanho} — {r.cor} — R${r.preco_aluguel} — {r.status}</span>
            <div className="flex gap-2">
              <button onClick={() => handleEditar(r)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Editar</button>
              <button onClick={() => handleExcluir(r.id)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
