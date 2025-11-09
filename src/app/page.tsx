/* eslint-disable @next/next/no-img-element */
"use client";
import DashboardLayout from "./_Components/Admin/Header";
import { signIn, useSession } from "next-auth/react";
import MainPage from "./_Components/MainPage";
import Link from "next/link";
import { ShoppingBag, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header/Navigation */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  StyleHub
                </span>
              </Link>
              {/* <nav className="hidden md:flex items-center gap-8">
                <Link
                  href="#products"
                  className="text-sm font-medium hover:text-primary transition"
                >
                  Products
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium hover:text-primary transition"
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium hover:text-primary transition"
                >
                  Pricing
                </Link>
              </nav> */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => signIn("google")}
                >
                  Log in
                </Button>
                {/* <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button> */}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-pretty">
                    Discover Your Perfect Style
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Curated collections from top brands delivered to your door.
                    Premium quality meets affordable pricing.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-base">
                    <Link href="/shop">Shop Now</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="text-base bg-transparent"
                  >
                    <Link href="/signup">Explore Collections</Link>
                  </Button>
                </div>
                <div className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">
                    Trusted by thousands of customers
                  </p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">4.9/5 Stars</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      50K+ Reviews
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative aspect-square bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden">
                  <img
                    src="/luxury-fashion-showcase.jpg"
                    alt="Fashion showcase"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-muted-foreground mb-8">
              Featured in & trusted by
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              {["Vogue", "Elle", "Harper's Bazaar", "GQ", "Forbes"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="text-center text-muted-foreground font-semibold text-sm sm:text-base"
                  >
                    {brand}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="products" className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why Choose StyleHub
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We&apos;re committed to providing the best shopping experience
                with quality products and exceptional service.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Fast Shipping",
                  description:
                    "Free shipping on orders over $50. Get your items in 2-3 business days.",
                },
                {
                  icon: Star,
                  title: "Premium Quality",
                  description:
                    "Hand-picked items from trusted designers and brands worldwide.",
                },
                {
                  icon: ShoppingBag,
                  title: "Easy Returns",
                  description:
                    "30-day money-back guarantee. No questions asked returns.",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-8 rounded-xl border border-border hover:border-primary/50 transition bg-card"
                  >
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16">
              Customer Love
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Fashion Enthusiast",
                  content:
                    "Best online shopping experience I've had. Quality products and fast delivery!",
                },
                {
                  name: "Michael Chen",
                  role: "Regular Customer",
                  content:
                    "The curated collections are amazing. I always find exactly what I'm looking for.",
                },
                {
                  name: "Emma Rodriguez",
                  role: "Style Blogger",
                  content:
                    "StyleHub has become my go-to shop. Customer service is outstanding!",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 bg-card rounded-xl border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 text-lg">
                    {testimonial.content}
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="pricing"
          className="py-20 md:py-32 bg-primary text-primary-foreground"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Start Shopping?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of satisfied customers. Get exclusive discounts
                on your first order.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-base font-semibold"
              >
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="text-base font-semibold"
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">About</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Follow</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition">
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 StyleHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  if (session?.user?.isAdmin) {
    return (
      <DashboardLayout>
        <span>Welcome Admin</span>
        <MainPage />
      </DashboardLayout>
    );
  }
  return (
    <div>
      <MainPage />
      {/* {session.user?.name} */}
    </div>
  );
}
