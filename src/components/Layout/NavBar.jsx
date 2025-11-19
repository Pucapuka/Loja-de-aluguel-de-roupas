import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex gap-4">
      <Link to="/">🏠 Início</Link>
      <Link to="/roupas">👗 Roupas</Link>
      <Link to="/clientes">🧍 Clientes</Link>
      <Link to="/alugueis">📦 Aluguéis</Link>
    </nav>
  );
}
