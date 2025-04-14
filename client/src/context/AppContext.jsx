import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext(); //Create context using createContext() method from react

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(true);
  const currency = import.meta.VITE_CURRENCY;
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = () => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Add to Cart");
  };

  const updateCardItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
  };
  const value = {
    navigate,
    user,
    currency,
    isSeller,
    showUserLogin,
    cartItems,
    addToCart,
    updateCardItem,
    removeFromCart,
    setShowUserLogin,
    products,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
