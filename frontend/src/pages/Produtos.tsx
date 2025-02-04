import { useContext } from "react";
import { ProdutoContext } from "../context/ProdutoContext";

const Produtos = () => {
  const produtoContext = useContext(ProdutoContext);

  if (!produtoContext) return <p>Carregando...</p>;

  const { produtos } = produtoContext;

  return (
    <div>
      <h1>Lista de Produtos para Aluguel</h1>
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            <strong>{produto.nome}</strong> - R$ {produto.preco}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produtos;
