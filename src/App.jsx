import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/NavBar";
import ListaRoupas from "./components/Roupas/ListaRoupas";
import ListaClientes from "./components/Clientes/ListaClientes";
import ListaAlugueis from "./components/Alugueis/ListaAlugueis";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h1>🏠 Bem-vindo à Loja de Roupas</h1>} />
          <Route path="/roupas" element={<ListaRoupas />} />
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/alugueis" element={<ListaAlugueis />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
