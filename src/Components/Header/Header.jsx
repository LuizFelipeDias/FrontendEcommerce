import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping, faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import "./Header.css";
import Logo from "../../assets/Logo";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems = [], updateCartItemQuantity, updateCartItemAttributes, removeFromCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    console.log("Pathname atualizado:", location.pathname);
  }, [location.pathname]);

  const handleCartClick = () => {
    setIsCartOpen((prevState) => !prevState);
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

  const toKebabCase = (str) => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="header">
      <div className={`overlay ${isCartOpen ? "active" : ""}`} onClick={handleCartClick}></div>

      <div className="logo-container">
        <Logo />
      </div>

      <nav>
        <ul>
          {["Home", "all", "clothes", "tech"].map((category) => (
            <li key={category}>
              <Link
                to={`/${category === "Home" ? "" : category}`}
                data-testid={location.pathname === `/${category === "Home" ? "" : category}` ? "active-category-link" : "category-link"}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="cart-container">
        <button onClick={handleCartClick} className="cart-btn" data-testid="cart-btn">
          <FontAwesomeIcon icon={faCartShopping} className="cart" />
          <div className="products-count">{cartItems.length}</div>
        </button>

        <div className={`cart-modal ${isCartOpen ? "active" : ""}`} data-testid="cart-overlay" style={{ pointerEvents: isCartOpen ? "auto" : "none" }}>
          <button className="close-modal" onClick={handleCartClick}>
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
                        {Object.entries(item.availableAttributes).map(([groupName, attributes]) => {
                          const kebabCaseGroupName = toKebabCase(groupName);
                          return (
                            <div key={groupName} className="cart-attribute-group">
                              <h4 className="cart-attribute-title">{groupName}:</h4>
                              <div className="cart-attribute-buttons">
                                {attributes.map((option) => {
                                  const kebabCaseOption = toKebabCase(option);
                                  const isSelected = item.attributes[groupName] === option;
                                  return (
                                    <button
                                      key={option}
                                      className={`cart-attribute-button ${isSelected ? "selected" : ""}`}
                                      style={groupName.toLowerCase() === "color" ? { backgroundColor: option } : {}}
                                      onClick={() => handleAttributeChange(item.uniqueId, groupName, option)}
                                      data-testid={`cart-item-attribute-${kebabCaseGroupName}-${kebabCaseOption}${isSelected ? "-selected" : ""}`}
                                    >
                                      {groupName.toLowerCase() !== "color" && option}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="add-and-remove-cart">
                    <div className="cart-item-quantity">
                      <button className="add-quantity" onClick={() => handleQuantityChange(item.uniqueId, item.quantity + 1)}
                        data-testid="cart-item-amount-increase">
                        <FontAwesomeIcon icon={faPlus} className="add"/>
                      </button>
                      <input
                        className="input-quntity"
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(item.uniqueId, parseInt(e.target.value))}
                      />
                      <button className="remove-quantity" onClick={() => handleQuantityChange(item.uniqueId, item.quantity - 1)}
                        data-testid="cart-item-amount-decrease">
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
            <p className="total">TOTAL: {calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
