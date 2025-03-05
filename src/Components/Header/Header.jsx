import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping, faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import "./Header.css";


const Header = () => {
  const {
    cartItems = [],
    updateCartItemQuantity,
    updateCartItemAttributes,
    removeFromCart,
    isCartOpen,
    openCart,
    closeCart,
  } = useCart(); // Adicione isCartOpen, openCart e closeCart ao destructuring

  const location = useLocation();

  useEffect(() => {
    console.log("Pathname atualizado:", location.pathname);
  }, [location.pathname]);

  const handleCartClick = () => {
    if (isCartOpen) {
      closeCart(); // Fecha o carrinho se estiver aberto
    } else {
      openCart(); // Abre o carrinho se estiver fechado
    }
  };

  const handleQuantityChange = (uniqueId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(uniqueId);
    } else {
      updateCartItemQuantity(uniqueId, newQuantity);
    }
  };

  const handleAttributeChange = (uniqueId, attributeName, newValue) => {
    const item = cartItems.find((item) => item.uniqueId === uniqueId);
    if (item) {
      const updatedAttributes = {
        ...item.attributes,
        [attributeName]: newValue,
      };
      updateCartItemAttributes(uniqueId, updatedAttributes);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="header">
      <div className={`overlay ${isCartOpen ? "active" : ""}`} onClick={closeCart}></div>

      <nav>
        <ul>
          <li>
            <Link 
              to="/all" 
              data-testid={location.pathname === "/all" ? "active-category-link" : "category-link"}
            >
              ALL
            </Link>
          </li>
          <li>
            <Link 
              to="/clothes" 
              data-testid={location.pathname === "/clothes" ? "active-category-link" : "category-link"}
            >
              CLOTHES
            </Link>
          </li>
          <li>
            <Link 
              to="/tech" 
              data-testid={location.pathname === "/tech" ? "active-category-link" : "category-link"}
            >
              TECH
            </Link>
          </li>
        </ul>
      </nav>

      <nav>
        <ul>
          <li>
            <Link 
              to="/" 
              data-testid={location.pathname === "/" ? "active-category-link" : "category-link"}
            >
              HOME
            </Link>
          </li>
        </ul>
      </nav>

      <div className="cart-container">
        <button onClick={handleCartClick} className="cart-btn" data-testid="cart-btn">
          <FontAwesomeIcon icon={faCartShopping} className="cart" />
          <div className="products-count" data-testid="cart-item-count">
            {cartItems.length} item(s) {/* Exibe o número de itens no carrinho */}
          </div>
        </button>

        <div className={`cart-modal ${isCartOpen ? "active" : ""}`} data-testid="cart-overlay" style={{ pointerEvents: isCartOpen ? "auto" : "none" }}> 
          <button className="close-modal" onClick={closeCart}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="cart-modal-content">
            <h2 className="cart-title">YOUR BAG</h2>
            <div className="cart-items-container">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item-container">
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{item.price} {item.currency}</p>
                    {item.availableAttributes && (
                      <div className="cart-item-attributes">
                        {Object.entries(item.availableAttributes).map(([groupName, attributes], index) => (
                          <div key={index} className="cart-attribute-group">
                            <h4 className="cart-attribute-title">{groupName}:</h4>
                            <div className="cart-attribute-buttons">
                              {attributes.map((option, optIdx) => (
                                <button
                                  key={optIdx}
                                  className={`cart-attribute-button ${item.attributes[groupName] === option ? "selected" : ""}`}
                                  style={groupName.toLowerCase() === "color" ? { backgroundColor: option } : {}}
                                  onClick={() => handleAttributeChange(item.uniqueId, groupName, option)}
                                >
                                  {groupName.toLowerCase() !== "color" && option}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="add-and-remove-cart">
                    <div className="cart-item-quantity">
                      <button className="add-quantity" onClick={() => handleQuantityChange(item.uniqueId, item.quantity + 1)}
                        data-testid='cart-item-amount-increase'
                        >
                        <FontAwesomeIcon icon={faPlus} className="add"/>
                      </button>
                      <input
                        className="input-quntity"
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(item.uniqueId, parseInt(e.target.value))}
                        data-testid='cart-item-amount'
                      />
                      <button className="remove-quantity" onClick={() => handleQuantityChange(item.uniqueId, item.quantity - 1)}
                        data-testid='cart-item-amount-decrease' 
                        >
                        <FontAwesomeIcon icon={faMinus}/>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-image-container">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </div>
                </div>
              ))}
            </div>
            <p className="total" data-testid='cart-total'> TOTAL: {calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;