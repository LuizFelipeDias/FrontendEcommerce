// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Components/Cart/CartContext"; // Caminho correto 
import Header from "./Components/Header/Header";
import Product from "./pages/Product";
import ProductSelected from "./pages/productSelected";
import All from "./pages/all";
import Clothes from "./pages/clothes";
import Tech from "./pages/tech";

const App = () => {
  return (
    <CartProvider> {/* Envolve a aplicação com o CartProvider */}
      <Router>
        <div className="container">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Product />} />
              <Route path="/product/:id" element={<ProductSelected />} />
              
              {/* Novas rotas para as categorias */}
              <Route path="/all" element={<All />} />
              <Route path="/clothes" element={<Clothes />} />
              <Route path="/tech" element={<Tech />} />

              {/* Rota para produto selecionado dentro de cada categoria */}
              <Route path="/all/product/:id" element={<ProductSelected />} />
              <Route path="/clothes/product/:id" element={<ProductSelected />} />
              <Route path="/tech/product/:id" element={<ProductSelected />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
