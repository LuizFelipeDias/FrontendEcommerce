import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../Components/Cart/CartContext";
import "./productSelected.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper and SwiperSlide
import 'swiper/css'; // Basic Swiper styles

const ProductSelected = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [isAllAttributesSelected, setIsAllAttributesSelected] = useState(false);
  const [mainImage, setMainImage] = useState(product?.images?.[0] || "https://via.placeholder.com/300"); // Estado para a imagem principal

  // Verifica se todos os atributos foram selecionados
  useEffect(() => {
    if (product?.attributes) {
      const allSelected = product.attributes.every(
        (attr) => selectedAttributes[attr.name]
      );
      setIsAllAttributesSelected(allSelected);
    }
  }, [selectedAttributes, product]);

  // Função para selecionar atributos
  const handleSelectAttribute = (name, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    if (!product || !isAllAttributesSelected) return;

    // Gera o uniqueId com base nos atributos selecionados
    const uniqueId = `${product.id}-${Object.entries(selectedAttributes)
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
      image: mainImage, // Usa a imagem principal atual
      price: parseFloat(product.amount || 0).toFixed(2),
      currency: product.currency_symbol,
      attributes: { ...selectedAttributes }, // Copia os atributos selecionados
      availableAttributes, // Inclui os atributos disponíveis
      quantity: 1,
    };

    addToCart(cartItem);
    console.log("Produto adicionado ao carrinho:", cartItem);
  };

  // Agrupa atributos pelo nome
  const groupedAttributes = product?.attributes?.reduce((acc, attr) => {
    (acc[attr.name] = acc[attr.name] || []).push(attr);
    return acc;
  }, {});

  // Função para trocar a imagem principal
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="product-container">
      <div className="swiper">
        <Swiper
          direction="vertical" // Define a direção vertical
          slidesPerView={5} // Exibe 5 slides por vez
          spaceBetween={12} // Espaço entre os slides
          className="swiper-container"
        >
          {product?.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail-image"
                onClick={() => handleThumbnailClick(image)} // Troca a imagem principal ao clicar
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="product-image-container">
        <img
          className="product-image"
          src={mainImage} // Usa a imagem principal atual
          alt={product?.name}
        />
      </div>

      <div className="product-details">
        <h2 className="product-title">{product?.name}</h2>
        <div className="product-attributes">
          {Object.entries(groupedAttributes || {}).map(([name, attributes], index) => (
            <div key={index} className="attribute-group">
              <h4 className="attribute-title">{name}:</h4>
              <div className="attribute-buttons">
                {attributes.map((attr, idx) => (
                  <button
                    key={idx}
                    className={`attribute-button ${
                      selectedAttributes[name] === attr.value ? "selected" : ""
                    }`}
                    style={name.toLowerCase() === "color" ? { backgroundColor: attr.value } : {}}
                    onClick={() => handleSelectAttribute(name, attr.value)}
                    data-testid={`product-attribute-${name.toLowerCase()}-${attr.value.replace(/#/g, "")}`} // Adiciona data-testid
                  >
                    {name.toLowerCase() !== "color" && attr.value}
                  </button>
                ))}
              </div>
              {!selectedAttributes[name] && (
                <p className="attribute-error">Please select an option..</p>
              )}
            </div>
          ))}
        </div>

        <h3 className="product-price">
          PRICE: <span>{parseFloat(product?.amount || 0).toFixed(2)} {product?.currency_symbol}</span>
        </h3>

        {product?.in_stock > 0 ? (
          <>
            <button
              className={`add-to-cart ${!isAllAttributesSelected ? "disabled" : ""}`}
              onClick={handleAddToCart}
              disabled={!isAllAttributesSelected}
              data-testid="add-to-cart-button" // Adiciona data-testid
            >
              ADD TO CART <FontAwesomeIcon icon={faCartShopping} /> <FontAwesomeIcon icon={faPlus} />
            </button>
            {!isAllAttributesSelected && (
              <p className="cart-error">Please select all attributes before adding to cart.</p>
            )}
          </>
        ) : (
          <p className="text-out-of-stock">This product is out of stock.</p>
        )}

        <p className="product-description">
          {product?.description || "Nenhuma descrição disponível."}
        </p>
      </div>
    </div>
  );
};

export default ProductSelected;