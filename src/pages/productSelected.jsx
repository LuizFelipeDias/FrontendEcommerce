import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../Components/Cart/CartContext";
import "./productSelected.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ProductSelected = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [isAllAttributesSelected, setIsAllAttributesSelected] = useState(false);
  const [mainImage, setMainImage] = useState(product?.images?.[0] || "https://via.placeholder.com/300");
  const [isCartOverlayVisible, setIsCartOverlayVisible] = useState(false); // Novo estado para exibir o overlay

  useEffect(() => {
    if (product?.attributes) {
      const allSelected = product.attributes.every(
        (attr) => selectedAttributes[attr.name]
      );
      setIsAllAttributesSelected(allSelected);
    }
  }, [selectedAttributes, product]);

  const handleSelectAttribute = (name, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!product || !isAllAttributesSelected) return;

    const uniqueId = `${product.id}-${Object.entries(selectedAttributes)
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
      image: mainImage,
      price: parseFloat(product.amount || 0).toFixed(2),
      currency: product.currency_symbol,
      attributes: { ...selectedAttributes },
      availableAttributes,
      quantity: 1,
    };

    addToCart(cartItem);
    console.log("Produto adicionado ao carrinho:", cartItem);

    // Exibir o cart overlay após adicionar ao carrinho
    setIsCartOverlayVisible(true);

    // Esconder o overlay após 5 segundos (ajustável)
    setTimeout(() => {
      setIsCartOverlayVisible(false);
    }, 5000);
  };

  const groupedAttributes = product?.attributes?.reduce((acc, attr) => {
    (acc[attr.name] = acc[attr.name] || []).push(attr);
    return acc;
  }, {});

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="product-container">
      <div className="swiper">
        <Swiper direction="vertical" slidesPerView={5} spaceBetween={12} className="swiper-container">
          {product?.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail-image"
                onClick={() => handleThumbnailClick(image)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="product-image-container">
        <img className="product-image" src={mainImage} alt={product?.name} />
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
                    className={`attribute-button ${selectedAttributes[name] === attr.value ? "selected" : ""}`}
                    style={name.toLowerCase() === "color" ? { backgroundColor: attr.value } : {}}
                    onClick={() => handleSelectAttribute(name, attr.value)}
                    data-testid={`product-attribute-${name.toLowerCase()}-${attr.value}`}
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
              data-testid="add-to-cart-button"
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

      {/* Cart Overlay */}
      {isCartOverlayVisible && (
        <div className="cart-overlay" data-testid="cart-overlay">
          <p>Item adicionado ao carrinho!</p>
        </div>
      )}
    </div>
  );
};

export default ProductSelected;
