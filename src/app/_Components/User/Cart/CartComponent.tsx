/* eslint-disable @next/next/no-img-element */
"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import {
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  clearCart,
} from "@/app/store/Cart/CartSlice";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ShoppingBag,
  Shield,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
import Link from "next/link";
import PayForm from "../../PayForm";

const CartComponent = () => {
  const dispatch = useAppDispatch();
  const { items, totalPrice, totalQuantity } = useAppSelector(
    (state) => state.carts
  );
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(
    new Set()
  );

  const handleIncrease = (productId: string) => {
    setDisabledButtons((prev) => new Set(prev).add(productId));
    dispatch(increaseQuantity(productId));
    setTimeout(() => {
      setDisabledButtons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 500);
  };

  const handleDecrease = (productId: string) => {
    setDisabledButtons((prev) => new Set(prev).add(productId));
    dispatch(decreaseQuantity(productId));
    setTimeout(() => {
      setDisabledButtons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 500);
  };

  const handleDelete = (productId: string) => {
    dispatch(deleteItem(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container max-w-svw py-8">
        <Card className="relative overflow-hidden bg-linear-to-br from-blue-50 to-indigo-100">
          <CardContent className="p-8 text-center relative z-10">
            {/* Empty Cart Icon */}
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center rounded-full bg-white/80 shadow-lg">
              <ShoppingCart className="w-16 h-16 text-blue-500" />
            </div>

            {/* Content */}
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Your Cart is Empty
            </CardTitle>

            <p className="text-lg text-muted-foreground mb-8">
              Looks like you haven&apos;t added anything to your cart yet
            </p>

            {/* Features list */}
            <div className="flex flex-col gap-3 mb-8 max-w-sm mx-auto">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Browse thousands of products</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg"
            >
              <Link href="/user/products">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping Now
              </Link>
            </Button>

            {/* Quick links */}
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-3">
                Popular Categories:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Electronics", "Fashion", "Home", "Sports"].map(
                  (category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="px-3 py-1 cursor-pointer hover:bg-blue-50"
                    >
                      {category}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 ml-5">
      <h1 className="text-3xl font-bold mb-6">
        Shopping Cart ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-3">
                    {/* Title and Delete */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          Category: {item.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDecrease(item.id)}
                          disabled={
                            disabledButtons.has(item.id) || item.quantity <= 1
                          }
                          className="h-8 w-8"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <div className="min-w-12 text-center font-medium">
                          {disabledButtons.has(item.id) ? (
                            <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleIncrease(item.id)}
                          disabled={disabledButtons.has(item.id)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Shopping Cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove all
                  items from your cart.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearCart}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <PayForm />

              <Button asChild variant="outline" className="w-full">
                <Link href="/user/products" className="flex items-center">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
