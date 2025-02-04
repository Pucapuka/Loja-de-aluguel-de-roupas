import { createContext, useEffect, useState, ReactNode } from "react";
import api from "../services/api";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
}

interface ProdutoContextProps {
  produtos: Produto[];
  carregarProdutos: () => void;
}

export const ProdutoContext = createContext<ProdutoContextProps | null>(null);

export const ProdutoProvider = ({ children }: { children: ReactNode }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const carregarProdutos = async () => {
    try {
      const response = await api.get("/produtos"); // Ajuste conforme o backend
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <ProdutoContext.Provider value={{ produtos, carregarProdutos }}>
      {children}
    </ProdutoContext.Provider>
  );
};
