import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProdutoProvider } from "./context/ProdutoContext";
import Produtos from "./pages/Produtos";

const App = () => {
  return (
    <ProdutoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Produtos />} />
        </Routes>
      </Router>
    </ProdutoProvider>
  );
};

export default App;
