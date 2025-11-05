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
import DeleteBTN from "@/app/_Components/Category/DeleteBTN";
import { Eye, Pencil } from "lucide-react";

interface category {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
}

interface categoriesResponse {
  categories: category[];
  count: number;
  status: number;
}

const CategoriesManagementPage = async () => {
  let categories: category[] = [];
  let error: string | null = null;
  try {
    const response = await fetch(`${domin}/api/category`, {
      cache: "no-store", // Ensures fresh data on every request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: categoriesResponse = await response.json();

    categories = data.categories || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    error = "Failed to load categories. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-bold">
                categories Management
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {categories.length} categories
                </Badge>
                <Button asChild size="sm">
                  <Link href="/category/new">Add category</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center p-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button asChild variant="outline">
                  <Link href="/category">Refresh</Link>
                </Button>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p className="mb-4">No categories found.</p>
                <Button asChild>
                  <Link href="/category/new">Add your first category</Link>
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
                          category Title
                        </TableHead>
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
                      {categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/category/${category._id}`}
                              className="hover:text-blue-600 hover:underline"
                            >
                              {category.title}
                            </Link>
                          </TableCell>

                          <TableCell className="max-w-[300px] truncate">
                            {category.description}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {category.createdAt
                              ? new Date(category.createdAt).toLocaleDateString(
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
                                href={`/category/${category._id}`}
                                className="text-blue-600 hover:underline text-sm font-medium"
                              >
                                View <Eye />
                              </Link>
                              <Link
                                href={`/category/${category._id}/edit`}
                                className="text-green-600 hover:underline text-sm font-medium"
                              >
                                Edit <Pencil />
                              </Link>
                              <DeleteBTN id={category._id} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {categories.map((category) => (
                    <Card key={category._id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">
                              {category.title}
                            </h3>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>

                          {category.createdAt && (
                            <p className="text-xs text-muted-foreground">
                              Created:{" "}
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Link href={`/category/${category._id}`}>
                                View <Eye />
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Link href={`/category/${category._id}/edit`}>
                                Edit <Pencil />
                              </Link>
                            </Button>
                            <DeleteBTN id={category._id} />
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

export default CategoriesManagementPage;
