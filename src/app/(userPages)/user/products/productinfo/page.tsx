/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import domin from "@/app/utils/Domin";
import { Iproducts, IProperties } from "@/app/server/getProducts";
import offerPrice from "@/app/utils/offerPrice";
import defaultImage from "@/app/assets/defualtImage.png";
import { useAppDispatch } from "@/app/store/hook";
import { addToCart } from "@/app/store/Cart/CartSlice";
import { useAlertShowHide } from "@/app/Context/SnackBar";

const ProductInfoPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");

  const [product, setProduct] = useState<Iproducts | null>(null);
  const { showAlert } = useAlertShowHide();
  const [properties, setProperties] = useState<IProperties[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (categoryId) {
        try {
          const response = await fetch(`${domin}/api/category/${categoryId}`);
          const data = await response.json();
          setCategory(data.category.title);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${domin}/api/products/${productId}`);
      const data = await response.json();

      const mockProduct: Iproducts = data.product as Iproducts;
      setProduct(mockProduct);
      setProperties(mockProduct.properties);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Iproducts) => {
    setIsAddedToCart(true);
    // setDisabledButtons((prev) => new Set(prev).add(id || 0));
    dispatch(
      addToCart({
        id: product._id,
        title: product.name,
        price: product.price,
        img: product.image || defaultImage.src,
        category: product.categoryId,
      })
    );

    // Add quantity times
    for (let i = 1; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product._id,
          title: product.name,
          price: product.price,
          img: product.image || defaultImage.src,
          category: product.categoryId,
        })
      );
    }
    showAlert(`added sucessfully , quantity (${quantity})`, "success");
    setQuantity(1); // Reset quantity
    setIsAddedToCart(false);
    // setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-xl">
              <img
                src={
                  imageError || !product.image
                    ? defaultImage.src
                    : product.image
                }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />

              {/* Like Button Overlay */}
              <Button
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "absolute top-4 right-4 h-12 w-12 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 z-10",
                  isLiked
                    ? "bg-red-500 hover:bg-red-600 text-white scale-100 ring-4 ring-red-500/30"
                    : "bg-white/95 hover:bg-white text-gray-700 hover:text-red-500"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isLiked && "fill-current"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Check className="h-3 w-3" />
                In Stock
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 py-4 border-y border-border/50">
              <span className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg text-muted-foreground line-through mb-1">
                {formatPrice(product.price * offerPrice)}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features Section */}
            {properties.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-xl">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                      <span className="font-medium text-sm text-muted-foreground">
                        {property.key}:
                      </span>
                      <span className="font-semibold text-foreground">
                        {property.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-semibold text-sm">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increase")}
                    className="h-10 w-10 rounded-none hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: {formatPrice(product.price * quantity)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => handleAddToCart(product)}
                className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isAddedToCart}
              >
                {isAddedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "h-12 w-12 transition-all",
                  isLiked && "bg-red-50 border-red-200 hover:bg-red-100"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    isLiked ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="p-2 rounded-lg bg-background">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    On orders over $50
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="p-2 rounded-lg bg-background">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Warranty</p>
                  <p className="text-xs text-muted-foreground">
                    2 years guarantee
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="p-2 rounded-lg bg-background">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">
                    30-day return policy
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">
                  {product._id?.slice(0, 8) || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">
                  {category || "Uncategorized"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability:</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPage;
