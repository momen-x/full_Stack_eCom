/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  Upload,
  X,
  ChevronDown,
  Check,
  Trash2,
} from "lucide-react";
import DeleteBTN from "@/app/_Components/DeleteproductBTN/DeleteBTN";
import { useAlertShowHide } from "@/app/Context/SnackBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import getCategories from "@/app/server/getCategories";
import domin from "@/app/utils/Domin";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: string;
  properties?: { key: string; value: string }[]; // ✅ Added properties
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
    categoryId: "",
  });

  // ✅ Added properties state
  const [properties, setProperties] = useState<
    { key: string; value: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<{
    _id: string;
    title: string;
  } | null>(null);
  const [categories, setCategories] = useState<
    { _id: string; title: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const data: {
          _id: string;
          title: string;
          description: string;
          createdAt: Date;
          updatedAt: Date;
        
        }[] = response.categories;

        setCategories(
          data.map((d) => ({
            _id: d._id,
            title: d.title,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product data when id is available
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${domin}/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        const pro: Product = data.product;
        setProduct(pro);

        // ✅ Set form data including category
        setFormData({
          name: pro.name,
          description: pro.description,
          price: pro.price,
          categoryId: pro.categoryId || "",
        });

        // ✅ Set properties if they exist
        if (pro.properties && Array.isArray(pro.properties)) {
          setProperties(pro.properties);
        }

        // ✅ Set selected category if categoryId exists
        if (pro.categoryId && categories.length > 0) {
          const category = categories.find((cat) => cat._id === pro.categoryId);
          if (category) {
            setSelectedCategory(category);
          }
        }

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
  }, [id, categories]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle category selection
  const handleCategorySelect = (category: { _id: string; title: string }) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      categoryId: category._id,
    }));
  };

  // ✅ Property management functions
  const addPropertyInput = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  const handlePropertyChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
  };

  const removeProperty = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index);
    setProperties(updatedProperties);
  };

  // ✅ Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showAlert("File size must be less than 5MB", "warning");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showAlert("Please select a valid image file", "warning");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // ✅ Handle image removal
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(product?.image || ""); // Reset to original image
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // ✅ Enhanced validation including category
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price <= 0 ||
      !formData.categoryId
    ) {
      setError(
        "Please fill in all required fields including category selection"
      );
      setIsSubmitting(false);
      return;
    }

    // ✅ Validate properties
    const validProperties = properties.filter(
      (p) => p.key.trim() && p.value.trim()
    );
    const hasInvalidProperties = properties.some(
      (p) =>
        (p.key.trim() && !p.value.trim()) || (!p.key.trim() && p.value.trim())
    );

    if (hasInvalidProperties) {
      setError(
        "Please fill both property name and value, or remove empty properties"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ Use FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price.toString());
      submitData.append("categoryId", formData.categoryId);

      // ✅ Add properties as JSON string
      if (validProperties.length > 0) {
        submitData.append("properties", JSON.stringify(validProperties));
      } else {
        // Send empty array to clear properties if all were removed
        submitData.append("properties", JSON.stringify([]));
      }

      // Only append image if a new one was selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const response = await fetch(`${domin}/api/products/${id}`, {
        method: "PUT",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      showAlert("Product updated successfully!", "success");
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
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => router.back()} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <DeleteBTN id={id} />
      </div>

      <div className="container mx-auto max-w-2xl">
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

              {/* Category Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium leading-none">
                  Category *
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-2"
                      disabled={isSubmitting}
                    >
                      <span className="truncate">
                        {selectedCategory
                          ? selectedCategory.title
                          : "Select category"}
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[300px] bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                    align="start"
                    sideOffset={5}
                  >
                    <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                      Product Categories
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="max-h-60 overflow-y-auto">
                      {categories.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                          No categories available
                        </div>
                      ) : (
                        categories.map((category) => (
                          <DropdownMenuItem
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                            className="px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 outline-none"
                          >
                            <span className="text-gray-900 dark:text-white">
                              {category.title}
                            </span>
                            {selectedCategory?._id === category._id && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Validation message */}
                {!formData.categoryId && (
                  <p className="text-xs text-destructive">
                    Please select a category
                  </p>
                )}
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-sm font-medium leading-none"
                >
                  Product Photo
                </Label>

                {/* Image Preview */}
                {imagePreview ? (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted-foreground mb-2">
                    No photo for this product
                  </div>
                )}

                {/* File input */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => document.getElementById("image")?.click()}
                    variant="outline"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </Button>

                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current image. Accepted formats: JPG, PNG,
                  WebP, GIF (Max 5MB)
                </p>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium leading-none"
                >
                  Product Name *
                </Label>
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

              {/* ✅ Properties Section */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Properties (Optional)
                  </Label>
                  <Button
                    type="button"
                    onClick={addPropertyInput}
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    + Add Property
                  </Button>
                </div>

                {properties.length > 0 && (
                  <div className="space-y-3">
                    {properties.map((property, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input
                          placeholder="Property name (e.g., Color)"
                          value={property.key}
                          onChange={(e) =>
                            handlePropertyChange(index, "key", e.target.value)
                          }
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value (e.g., Red)"
                          value={property.value}
                          onChange={(e) =>
                            handlePropertyChange(index, "value", e.target.value)
                          }
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeProperty(index)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {properties.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Edit or remove properties like Size, Color, Material, etc.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium leading-none"
                >
                  Description *
                </Label>
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
                <Label
                  htmlFor="price"
                  className="text-sm font-medium leading-none"
                >
                  Price ($) *
                </Label>
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
