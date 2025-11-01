import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import domin from "@/app/utils/Domin";
import DeleteBTN from "@/app/_Components/DeleteBTN/DeleteBTN";
import { Eye, Pencil } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
}

interface ProductsResponse {
  products: Product[];
  count: number;
  status: number;
}

const ProductsManagementPage = async () => {
  let products: Product[] = [];
  let error: string | null = null;
  try {
    const response = await fetch(`${domin}/api/products`, {
      cache: "no-store", // Ensures fresh data on every request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();

    products = data.products || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error = "Failed to load products. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-bold">
                Products Management
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {products.length} products
                </Badge>
                <Button asChild size="sm">
                  <Link href="/products/new">Add Product</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center p-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button asChild variant="outline">
                  <Link href="/products">Refresh</Link>
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p className="mb-4">No products found.</p>
                <Button asChild>
                  <Link href="/products/new">Add your first product</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          Product Name
                        </TableHead>
                        <TableHead className="w-[120px]">Price</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[150px]">
                          Created Date
                        </TableHead>
                        <TableHead className="text-right w-[180px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/products/${product._id}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {product.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-semibold">
                              ${product.price.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {product.description}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-3">
                              <Link
                                href={`/products/${product._id}`}
                                className="text-blue-600 hover:underline text-sm font-medium"
                              >
                                View <Eye />
                              </Link>
                              <Link
                                href={`/products/${product._id}/edit`}
                                className="text-green-600 hover:underline text-sm font-medium"
                              >
                                Edit <Pencil />
                              </Link>
                              <DeleteBTN id={product._id} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {products.map((product) => (
                    <Card key={product._id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">
                              {product.name}
                            </h3>
                            <Badge variant="outline" className="font-semibold">
                              ${product.price.toFixed(2)}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>

                          {product.createdAt && (
                            <p className="text-xs text-muted-foreground">
                              Created:{" "}
                              {new Date(product.createdAt).toLocaleDateString()}
                            </p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Link href={`/products/${product._id}`}>
                                View <Eye />
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Link href={`/products/${product._id}/edit`}>
                                Edit <Pencil />
                              </Link>
                            </Button>
                            <DeleteBTN id={product._id} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsManagementPage;
// ```

// ## **Key Changes:**

// 1. ✅ **Fixed API endpoint** - Changed from `${domin}/products` to `${domin}/api/products`
// 2. ✅ **Added TypeScript interfaces** - Properly typed Product and ProductsResponse
// 3. ✅ **Fixed data extraction** - `products = data.products || []` instead of just `data`
// 4. ✅ **Added proper error handling** - Check `response.ok` and provide user-friendly error messages
// 5. ✅ **Added cache control** - `cache: "no-store"` for fresh data
// 6. ✅ **Fixed price display** - Added `.toFixed(2)` for consistent formatting
// 7. ✅ **Improved date formatting** - Better date display with locale options
// 8. ✅ **Added "Add Product" button** - In the header for easy access
// 9. ✅ **Added mobile responsive view** - Cards for mobile, table for desktop
// 10. ✅ **Changed delete to button** - Delete link changed to button with confirmation (since it should be a POST/DELETE request, not a GET)
// 11. ✅ **Better empty states** - More user-friendly messages and actions
// 12. ✅ **Improved styling** - Better spacing and visual hierarchy

// ## **File Structure:**

// Make sure your file is at:
// ```
// app/
//   products/
//     page.tsx  ← This products management page
