/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { actGetWishlist } from "@/app/store/Wishlist/WishlistSlice";

import { Iproducts } from "@/app/server/getProducts";
import domin from "@/app/utils/Domin";
import offerPrice from "@/app/utils/offerPrice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Heart, ShoppingCart, Truck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useState } from "react";
import defaultImage from "@/app/assets/defualtImage.png";
import { addToCart } from "@/app/store/Cart/CartSlice";
import { useSession } from "next-auth/react";

const DisplayProductList = ({ products }: { products: Iproducts[] }) => {
  const { data: session } = useSession();
  const wishlist = useAppSelector((state) => state.wishlist);
  const userId = session?.user.id; // Get this from your auth/session  const [, setHoveredProduct] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();


  
  const toggleLike = (productId: string) => {
    dispatch(
      actGetWishlist({
        userId: userId || "",
        productId: productId,
        wishlist: wishlist.productId.map(String),
      })
    );
    router.refresh();
  };

  const handleMoreDetails = (product: Iproducts) => {
    router.push(
      `${domin}/user/products/productinfo?productId=${product._id}&categoryId=${product.categoryId}`
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddToCart = (product: Iproducts) => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.name,
        price: product.price,
        img: product.image || defaultImage.src,
        category: product.categoryId,
      })
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="group relative bg-linear-to-br from-card via-card to-muted/20 rounded-3xl border border-border/40 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden"
          // onMouseEnter={() => setHoveredProduct(product._id!)}
          // onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

          {/* Product Image Container */}
          <div className="relative aspect-square overflow-hidden bg-linear-to-br from-muted/50 to-muted">
            <img
              src={product.image || defaultImage.src}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.currentTarget.src = defaultImage.src;
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
              {/* New & Featured Badges */}
              <div className="flex flex-col gap-2">
                <div className="px-3 py-1.5 rounded-full bg-linear-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-lg backdrop-blur-sm">
                  NEW
                </div>
                <div className="px-3 py-1.5 rounded-full bg-linear-to-r from-green-500 to-green-600 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                  FEATURED
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {/* Like Button */}
                <Button
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(product._id!);
                  }}
                  className={cn(
                    "h-10 w-10 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 border mt-16",
                    wishlist.productId.includes(product._id)
                      ? "bg-red-500 hover:bg-red-600 text-white scale-110 border-red-500/30"
                      : "bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 border-white/50 hover:scale-110"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      wishlist.productId.includes(product._id) &&
                        "fill-current scale-110"
                    )}
                  />
                </Button>

                {/* View Details Button */}
                <Button
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoreDetails(product);
                  }}
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-primary backdrop-blur-md shadow-xl border border-white/50 transition-all duration-300 hover:scale-110"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions Bar - Appears on Hover */}
            <div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-white hover:bg-white text-gray-900 font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 rounded-xl h-11 border border-white/50"
                  size="lg"
                  onClick={() => {
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Discount Badge */}
            <div className="absolute top-4 right-4 z-20">
              <div className="px-3 py-1.5 rounded-full bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-bold shadow-lg">
                {Math.round((offerPrice - 1) * 100)}% OFF
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {product.categoryId?.slice(0, 8) || "General"}
              </span>

              {/* Star Rating */}
              {/* <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">(24)</span>
              </div> */}
            </div>

            {/* Title */}
            <h3 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-12">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-10">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-muted-foreground line-through mb-0.5">
                  {formatPrice(product.price * offerPrice)}
                </span>
              </div>

              {/* Savings */}
              <div className="text-xs text-green-600 font-semibold">
                Save {formatPrice(product.price * offerPrice - product.price)}
              </div>
            </div>

            {/* Features & Status */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Quick Features */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Truck className="h-3 w-3" />
                <Zap className="h-3 w-3" />
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                Added {formatDate(product.createdAt)}
              </span>
              <span className="font-medium text-primary/80">Free Shipping</span>
            </div>
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default DisplayProductList;
