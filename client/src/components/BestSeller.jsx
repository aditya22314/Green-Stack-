import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  console.log(products, "9");
  return (
    <div className="mt-16">
      <p className={"text-2xl md:text-3xl font-medium"}>BestSeller</p>
      <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => {
            console.log(product, "100");
            return <ProductCard key={index} product={product} />;
          })}
      </div>
    </div>
  );
};

export default BestSeller;
