import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext(); //Create context using createContext() method from react

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
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
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  const value = {
    navigate,
    user,
    currency,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    cartItems,
    getCartAmount,
    getCartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    setShowUserLogin,
    products,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
