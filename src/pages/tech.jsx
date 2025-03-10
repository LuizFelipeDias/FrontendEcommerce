import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCartShopping, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../Components/Cart/CartContext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("https://backend-production-6806.up.railway.app/backend/consultas/categories/tech.php")
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

  const handleAddToCart = (product) => {
    if (!product || product.in_stock === 0) return;

    const selectedAttributes = product.attributes?.reduce((acc, attr) => {
      if (!acc[attr.name]) {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {});

    const uniqueId = `${product.id}-${Object.entries(selectedAttributes || {})
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}:${value}`)
      .join("-")}`;

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
      attributes: { ...selectedAttributes },
      availableAttributes,
      quantity: 1,
    };

    addToCart(cartItem);
    console.log("Produto adicionado ao carrinho:", cartItem);
  };

  return (
    <div>
      <div className="page-inner-content">
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => {
              const productTestId = `product-${product.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")}`;

              return (
                <div
                  key={product.id}
                  className="product border rounded-lg p-4 shadow-md cursor-pointer relative"
                  onClick={() => handleProductClick(product)}
                  data-testid={productTestId}
                >
                  <div className={`image ${product.in_stock === 0 ? "out-of-stock" : ""}`}>
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded"
                      />
                    ) : (
                      <p className="text-center text-gray-500">Sem imagem disponível</p>
                    )}
                    {product.in_stock === 0 && <div className="out-of-stock-label">Out of Stock</div>}
                  </div>

                  <h2 className="product-text">{product.name}</h2>

                  <p className="price-text" data-testid={`price-${product.id}`}>
                    {parseFloat(product.amount || 0).toFixed(2)} {product.currency_symbol}
                  </p>

                  <div className="info-and-cart">
                    <button className="product-info">
                      See Details <FontAwesomeIcon icon={faCircleInfo} />
                    </button>

                    {product.in_stock > 0 && (
                      <button
                        className="add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart <FontAwesomeIcon icon={faCartShopping} /> <FontAwesomeIcon icon={faPlus} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>Carregando produtos...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
