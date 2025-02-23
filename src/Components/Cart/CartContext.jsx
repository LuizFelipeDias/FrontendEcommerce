import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const matchingItems = prevItems.filter(
        (item) => JSON.stringify(item.attributes) === JSON.stringify(product.attributes)
      );

      if (matchingItems.length > 0) {
        return prevItems.map((item) =>
          JSON.stringify(item.attributes) === JSON.stringify(product.attributes)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, uniqueId: Date.now() }];
      }
    });
    setIsCartOverlayOpen(true); // Abre o overlay ao adicionar um item
  };

  const updateCartItemQuantity = (uniqueId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const updateCartItemAttributes = (uniqueId, updatedAttributes) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, attributes: updatedAttributes }
          : item
      );
    });
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.uniqueId !== uniqueId));
  };

  const openCartOverlay = () => {
    setIsCartOverlayOpen(true); // Função para abrir o overlay
  };

  const closeCartOverlay = () => {
    setIsCartOverlayOpen(false); // Função para fechar o overlay
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        updateCartItemAttributes,
        removeFromCart,
        isCartOverlayOpen,
        openCartOverlay,
        closeCartOverlay,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};