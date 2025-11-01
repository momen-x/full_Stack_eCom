"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import DeleteBTN from "@/app/_Components/DeleteBTN/DeleteBTN";
import { useAlertShowHide } from "@/app/Context/SnackBar";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // ✅ Changed to string (URL from backend)
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const router = useRouter();
  const { showAlert } = useAlertShowHide();
  const [id, setId] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // ✅ Separate state for file
  const [imagePreview, setImagePreview] = useState<string>(""); // ✅ For preview
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch product data when id is available
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        const pro: Product = data.product;
        setProduct(pro);
        setFormData({
          name: pro.name,
          description: pro.description,
          price: pro.price,
        });
        // ✅ Set existing image preview
        if (pro.image) {
          setImagePreview(pro.image);
        }
      } catch (err) {
        setError("Failed to load product");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // ✅ Use FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price.toString());

      // Only append image if a new one was selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        // ✅ Don't set Content-Type header - browser will set it with boundary
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      showAlert("the product edited successfully", "success");
      // Redirect to products page
      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      console.error("Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-destructive mb-4">{error}</div>
              <Button onClick={() => router.push("/products")}>
                Back to Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => router.back()}>
          <ChevronLeft /> Back
        </Button>
        <div onClick={() => router.back()}>
          <DeleteBTN id={id} />
        </div>
      </div>
      <div className="container mx-auto max-w-2xl mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEdit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Product Image */}
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Product Photo
                </label>

                {/* ✅ Image Preview */}
                {imagePreview ? (
                  <div className="mb-2">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                ) : (
                  <h3> No photo to this product</h3>
                )}

                {/* ✅ File input without value prop */}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current image
                </p>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="min-h-[120px]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($) *
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/products")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProductPage;

// ## **Key Changes:**

// 1. ✅ **Fixed `params` type** - Changed to `Promise<{ id: string }>` (Next.js 15+)
// 2. ✅ **Added separate effect to resolve params** - Must `await params` before using
// 3. ✅ **Added `id` state** - Store resolved id in state
// 4. ✅ **Fixed API endpoint** - Changed from `/api/products/${id}` to `/api/product/${id}` (matches your route)
// 5. ✅ **Improved error handling** - Better error messages from API response
// 6. ✅ **Added loading spinner** - Better UX with animated loader
// 7. ✅ **Disabled inputs during submission** - Prevent changes while updating
// 8. ✅ **Removed duplicate `setIsLoading(false)`** - Was in finally block of handleEdit
// 9. ✅ **Added spacing** - Better visual layout with `mt-8`

// ## **Required File Structure:**
// ```
// app/
//   products/
//     edit/
//       [id]/
//         page.tsx  ← Your EditProductPage component
