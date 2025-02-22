import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../Components/Cart/CartContext";
import "./productSelected.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper and SwiperSlide
import 'swiper/css'; // Basic Swiper styles
import kebabCase from "lodash/kebabCase"; // Correct import for kebabCase

const ProductSelected = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [isAllAttributesSelected, setIsAllAttributesSelected] = useState(false);
  const [mainImage, setMainImage] = useState(product?.images?.[0] || "https://via.placeholder.com/300"); // State for the main image

  // Check if all attributes are selected
  useEffect(() => {
    if (product?.attributes) {
      const allSelected = product.attributes.every(
        (attr) => selectedAttributes[attr.name]
      );
      setIsAllAttributesSelected(allSelected);
    }
  }, [selectedAttributes, product]);

  // Function to select attributes
  const handleSelectAttribute = (name, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to add to cart
  const handleAddToCart = () => {
    if (!product || !isAllAttributesSelected) return;

    // Generate uniqueId based on selected attributes
    const uniqueId = `${product.id}-${Object.entries(selectedAttributes)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort attributes by name
      .map(([key, value]) => `${key}:${value}`) // Format as "name:value"
      .join("-")}`; // Join with "-"

    // Create an object with available attributes
    const availableAttributes = product.attributes?.reduce((acc, attr) => {
      acc[attr.name] = acc[attr.name] || [];
      acc[attr.name].push(attr.value);
      return acc;
    }, {});

    const cartItem = {
      id: product.id,
      uniqueId,
      name: product.name,
      image: mainImage, // Use the current main image
      price: parseFloat(product.amount || 0).toFixed(2),
      currency: product.currency_symbol,
      attributes: { ...selectedAttributes }, // Copy selected attributes
      availableAttributes, // Include available attributes
      quantity: 1,
    };

    addToCart(cartItem);
    console.log("Product added to cart:", cartItem);
  };

  // Group attributes by name
  const groupedAttributes = product?.attributes?.reduce((acc, attr) => {
    (acc[attr.name] = acc[attr.name] || []).push(attr);
    return acc;
  }, {});

  // Function to change the main image
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="product-container">
      <div className="swiper" data-testid="product-gallery">
        <Swiper
          direction="vertical" // Set vertical direction
          slidesPerView={5} // Display 5 slides at once
          spaceBetween={12} // Space between slides
          className="swiper-container"
        >
          {product?.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail-image"
                onClick={() => handleThumbnailClick(image)} // Change main image on click
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="product-image-container">
        <img
          className="product-image"
          src={mainImage} // Use the current main image
          alt={product?.name}
        />
      </div>

      <div className="product-details">
        <h2 className="product-title">{product?.name}</h2>
        <div className="product-attributes">
          {Object.entries(groupedAttributes || {}).map(([name, attributes], index) => (
            <div key={index} className="attribute-group" data-testid={`product-attribute-${kebabCase(name)}`}>
              <h4 className="attribute-title">{name}:</h4>
              <div className="attribute-buttons">
                {attributes.map((attr, idx) => (
                  <button
                    key={idx}
                    className={`attribute-button ${
                      selectedAttributes[name] === attr.value ? "selected" : ""
                    }`}
                    style={name === "Color" ? { backgroundColor: attr.value } : {}}
                    onClick={() => handleSelectAttribute(name, attr.value)}
                  >
                    {name !== "Color" && attr.value}
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
              data-testid="add-to-cart"
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
        
        <p className="product-description" data-testid="product-description">
          {product?.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default ProductSelected;