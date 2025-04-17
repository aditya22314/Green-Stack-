import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import LoginForm from "./components/LoginForm";
import AllProducts from "./components/AllProducts";
const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();
  console.log(showUserLogin, "po");
  return (
    <div>
      <Toaster />
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <LoginForm /> : null}
      <div className={`${isSellerPath} ? "":"px-6 md:px-16 lg:px-24 xl:px-32"`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
