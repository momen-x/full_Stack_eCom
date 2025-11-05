"use client";

import getProductsFromDB, { Iproducts } from "@/app/server/getProducts";
import { useEffect, useState } from "react";
import defaultImage from "@/app/assets/defualtImage.png";
import DisplayProductList from "./DisplayProductsList";
import { ShoppingCart, TrendingUp } from "lucide-react";

const DisplayUserProducts = () => {
  const [productData, setProductData] = useState<Iproducts[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const data = (await getProductsFromDB()).products;
      const ListOfProduct = data.map((product) => {
        return {
          _id: product._id || `product-${Math.random()}`,
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          image: product.image || defaultImage.src,
          price: product.price,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          properties: product.properties,
        };
      });
      setProductData(ListOfProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="min-h-screen  from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Featured Collection
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Discover Amazing Products
          </h1>
          <p className="text-muted-foreground">
            Browse our curated selection of premium items
          </p>
        </div>

        {/* Products Grid */}
        <DisplayProductList products={productData} />

        {/* Empty State */}
        {productData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              Check back later for amazing deals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayUserProducts;
