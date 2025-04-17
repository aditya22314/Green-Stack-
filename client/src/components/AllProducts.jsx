import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const AllProducts = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);
  return (
    <div className="mt-16 flex flex-col">
      <p className="text-2xl font-medium uppercase">AllProducts</p>
      <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3  md:gap-6 lg:grid-cols-5 mt-6">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => {
            return <ProductCard key={index} product={product} />;
          })}
      </div>
    </div>
  );
};

export default AllProducts;
