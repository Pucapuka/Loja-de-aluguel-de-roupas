import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/NavBar";
import ListaRoupas from "./components/Roupas/ListaRoupas";
import ListaClientes from "./components/Clientes/ListaClientes";
import ListaAlugueis from "./components/Alugueis/ListaAlugueis";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h1>🏠 Bem-vindo à Loja de Roupas</h1>} />
          <Route path="/roupas" element={<ListaRoupas />} />
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/alugueis" element={<ListaAlugueis />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}