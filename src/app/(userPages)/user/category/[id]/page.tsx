import DisplayProductList from "@/app/_Components/User/product/DisplayProductsList";
import getProductsFromDB from "@/app/server/getProducts";
import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import {
  ArrowBigLeftDash,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

const CategoryDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const response = await fetch(`${domin}/api/category/${id}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  const data = await response.json();

  const products = (await getProductsFromDB()).products;
  const productsList = products.filter((product) => {
    return product.categoryId === id;
  });

  const productCount = productsList.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/5">
      {/* Header Section */}
      <div className="bg-linear-to-r from-primary/5 via-primary/10 to-accent/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Home
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Categories
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {data.category.title}
            </span>
          </nav>
          {/* Back to category page */}
          <Link href={"/user/category"}>
            Back
            <ArrowBigLeftDash />
          </Link>
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-linear-to-br from-primary to-primary/60 shadow-lg">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {data.category.title.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {data.category.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                    Discover our premium collection of{" "}
                    {data.category.title.toLowerCase()} products. Carefully
                    curated for quality and style.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Stats */}
            <div className="hidden lg:flex flex-col items-end space-y-2">
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {productCount}
                </div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Results Count */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {productCount}
                </span>{" "}
                products
              </span>

              {/* Active Filters (you can add later) */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  All Items
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center space-x-1 p-1 rounded-lg bg-muted">
                <Button className="p-2 rounded-md hover:bg-background transition-colors">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button className="p-2 rounded-md bg-background shadow-sm transition-colors">
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort & Filter */}
              <div className="flex items-center space-x-3">
                <select className="text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Best Rating</option>
                </select>

                <Button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-sm">Filters</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productCount > 0 ? (
          <DisplayProductList products={productsList} />
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-muted to-muted/50 flex items-center justify-center">
                <Filter className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t find any products in this category. Check back
                later or browse other categories.
              </p>
              <Button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Browse All Categories
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Category Features */}
      {productCount > 0 && (
        <div className="border-t border-border/50 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Why Choose Our {data.category.title}?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Premium quality, exceptional value, and unmatched customer
                service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm">
                <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Premium Quality
                </h3>
                <p className="text-sm text-muted-foreground">
                  Carefully selected products that meet our high standards
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm">
                <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Fast Shipping
                </h3>
                <p className="text-sm text-muted-foreground">
                  Free delivery on orders over $50
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm">
                <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Easy Returns
                </h3>
                <p className="text-sm text-muted-foreground">
                  30-day hassle-free return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailsPage;
