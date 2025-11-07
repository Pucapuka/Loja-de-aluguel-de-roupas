import React, { useEffect, useState } from "react";
import FormClientes from "./FormClientes";

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [editarCliente, setEditarCliente] = useState(null);

  const carregar = async () => {
    const res = await fetch("http://localhost:5000/api/clientes");
    setClientes(await res.json());
  };

  useEffect(() => { carregar(); }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    await fetch(`http://localhost:5000/api/clientes/${id}`, { method: "DELETE" });
    carregar();
  };

  const handleEditar = (c) => setEditarCliente(c);
  const handleSalvarEdicao = () => { setEditarCliente(null); carregar(); };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">🧍 Clientes</h2>
      <FormClientes onSave={editarCliente ? handleSalvarEdicao : carregar} editar={editarCliente} />
      <ul className="mt-4">
        {clientes.map((c) => (
          <li key={c.id} className="flex justify-between items-center p-2 border-b">
            <span>{c.nome} — {c.telefone} — {c.email}</span>
            <div className="flex gap-2">
              <button onClick={() => handleEditar(c)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Editar</button>
              <button onClick={() => handleExcluir(c.id)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
