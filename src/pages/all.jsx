import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCartShopping, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../Components/cart/CartContext"; // Importe o contexto do carrinho

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Use o hook do carrinho

  useEffect(() => {
    fetch("https://backend-production-6806.up.railway.app/backend/consultas/categories/all.php")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]));
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Função para adicionar ao carrinho com os primeiros atributos selecionados
  const handleAddToCart = (product) => {
    if (!product || product.in_stock === 0) return;

    // Seleciona os primeiros valores de cada atributo
    const selectedAttributes = product.attributes?.reduce((acc, attr) => {
      if (!acc[attr.name]) {
        acc[attr.name] = attr.value; // Seleciona o primeiro valor disponível
      }
      return acc;
    }, {});

    // Gera o uniqueId com base nos atributos selecionados
    const uniqueId = `${product.id}-${Object.entries(selectedAttributes || {})
      .sort((a, b) => a[0].localeCompare(b[0])) // Ordena os atributos por nome
      .map(([key, value]) => `${key}:${value}`) // Formata como "nome:valor"
      .join("-")}`; // Junta tudo com "-"

    // Cria um objeto com os atributos disponíveis
    const availableAttributes = product.attributes?.reduce((acc, attr) => {
      acc[attr.name] = acc[attr.name] || [];
      acc[attr.name].push(attr.value);
      return acc;
    }, {});

    const cartItem = {
      id: product.id,
      uniqueId,
      name: product.name,
      image: product.images?.[0] || "https://via.placeholder.com/300",
      price: parseFloat(product.amount || 0).toFixed(2),
      currency: product.currency_symbol,
      attributes: { ...selectedAttributes }, // Copia os atributos selecionados
      availableAttributes, // Inclui os atributos disponíveis
      quantity: 1,
    };

    addToCart(cartItem); // Adiciona ao carrinho
    console.log("Produto adicionado ao carrinho:", cartItem);
  };

  return (
    <div>
      <div className="page-inner-content">
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="product border rounded-lg p-4 shadow-md cursor-pointer relative"
                onClick={() => handleProductClick(product)}
              >
                <div className={`image ${product.in_stock == 0 ? "out-of-stock" : ""}`}>
                  {product.images?.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded" />
                  ) : (
                    <p className="text-center text-gray-500">Sem imagem disponível</p>
                  )}
                  {product.in_stock === 0 && <div className="out-of-stock-label">Out of Stock</div>}
                </div>

                <h2 className="product-text">{product.name}</h2>

                <p className="price-text">
                  {parseFloat(product.amount).toFixed(2)} {product.currency_symbol}
                </p>

                <div className="info-and-cart">
                  <button className="product-info">
                    See Details <FontAwesomeIcon icon={faCircleInfo} />
                  </button>

                  {product.in_stock > 0 && (
                    <button
                      className="add-cart"
                      onClick={(e) => {
                        e.stopPropagation(); // Impede que o clique no botão propague para o contêiner do produto
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart <FontAwesomeIcon icon={faCartShopping} /> <FontAwesomeIcon icon={faPlus} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Carregando produtos...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;