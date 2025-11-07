import React, { useEffect, useState } from "react";
import FormAlugueis from "./FormAlugueis";

export default function ListaAlugueis() {
  const [alugueis, setAlugueis] = useState([]);
  const [editarAluguel, setEditarAluguel] = useState(null);

  const carregar = async () => {
    const res = await fetch("http://localhost:5000/api/alugueis");
    setAlugueis(await res.json());
  };

  useEffect(() => { carregar(); }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este aluguel?")) return;
    await fetch(`http://localhost:5000/api/alugueis/${id}`, { method: "DELETE" });
    carregar();
  };

  const handleEditar = (a) => setEditarAluguel(a);
  const handleSalvarEdicao = () => { setEditarAluguel(null); carregar(); };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📦 Aluguéis</h2>
      <FormAlugueis onSave={editarAluguel ? handleSalvarEdicao : carregar} editar={editarAluguel} />
      <ul className="mt-4">
        {alugueis.map((a) => (
          <li key={a.id} className="flex justify-between items-center p-2 border-b">
            <span>Roupa #{a.roupa_id} — Cliente #{a.cliente_id} ({a.data_inicio} → {a.data_fim}) — R${a.valor_total}</span>
            <div className="flex gap-2">
              <button onClick={() => handleEditar(a)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Editar</button>
              <button onClick={() => handleExcluir(a.id)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
