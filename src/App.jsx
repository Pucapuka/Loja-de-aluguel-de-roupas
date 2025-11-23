import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/NavBar";
import ListaProdutos from "./components/Produtos/ListaProdutos.jsx";
import ListaClientes from "./components/Clientes/ListaClientes";
import ListaAlugueis from "./components/Alugueis/ListaAlugueis";
import Home from "./components/Home/Home.jsx";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/produtos" element={<ListaProdutos />} />
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/alugueis" element={<ListaAlugueis />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}