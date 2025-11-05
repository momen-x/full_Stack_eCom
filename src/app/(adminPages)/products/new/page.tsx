"use client";
import { useAlertShowHide } from "@/app/Context/SnackBar";
import getCategories from "@/app/server/getCategories";
import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import {
  ChevronLeft,
  Upload,
  X,
  ChevronDown,
  Check,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AddNewProduct() {
  const { showAlert } = useAlertShowHide();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addProductInfo, setAddProductInfo] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
  });

  // ✅ Fixed property state with proper typing
  const [properties, setProperties] = useState<
    { key: string; value: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<{
    _id: string;
    title: string;
  } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    { _id: string; title: string }[]
  >([]);

  useEffect(() => {
    const fetchCategory = async () => {
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
    fetchCategory();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setAddProductInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategorySelect = (category: { _id: string; title: string }) => {
    setSelectedCategory(category);
    setAddProductInfo((prev) => ({
      ...prev,
      categoryId: category._id,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("File size must be less than 5MB", "warning");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showAlert("Please select a valid image file", "warning");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearInputs = () => {
    setAddProductInfo({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
    });
    setSelectedCategory(null);
    setImageFile(null);
    setImagePreview("");
    setProperties([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Add new property input fields
  const addPropertyInput = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  // ✅ Update property key or value
  const handlePropertyChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
  };

  // ✅ Remove a property
  const removeProperty = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index);
    setProperties(updatedProperties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation including category
    if (
      !addProductInfo.name.trim() ||
      !addProductInfo.description.trim() ||
      addProductInfo.price <= 0 ||
      !addProductInfo.categoryId
    ) {
      showAlert(
        "Please fill in all required fields including category selection",
        "destructive"
      );
      return;
    }

    // ✅ Validate properties (ensure both key and value are filled)
    const validProperties = properties.filter(
      (p) => p.key.trim() && p.value.trim()
    );
    const hasInvalidProperties = properties.some(
      (p) =>
        (p.key.trim() && !p.value.trim()) || (!p.key.trim() && p.value.trim())
    );

    if (hasInvalidProperties) {
      showAlert(
        "Please fill both property name and value, or remove empty properties",
        "destructive"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", addProductInfo.name.trim());
      formData.append("description", addProductInfo.description.trim());
      formData.append("price", addProductInfo.price.toString());
      formData.append("categoryId", addProductInfo.categoryId);

      // ✅ Add properties as JSON string
      if (validProperties.length > 0) {
        formData.append("properties", JSON.stringify(validProperties));
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(`${domin}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showAlert("Product added successfully!", "success");
      router.refresh();
      handleClearInputs();
    } catch (error) {
      console.error("Error adding product:", error);
      if (axios.isAxiosError(error)) {
        showAlert(
          `${error.response?.data?.message || "Failed to add product"}`,
          "destructive"
        );
      } else {
        showAlert("Failed to add product", "destructive");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Button onClick={() => router.back()} variant="outline" className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="container mx-auto p-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new product to your store
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

              {!addProductInfo.categoryId && (
                <p className="text-xs text-destructive">
                  Please select a category
                </p>
              )}
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label
                htmlFor="productName"
                className="text-sm font-medium leading-none"
              >
                Product Name *
              </Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                placeholder="Enter product name"
                value={addProductInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* ✅ Properties Section - IMPROVED */}
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
                  Add custom properties like Size, Color, Material, etc.
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
                name="description"
                placeholder="Enter detailed product description"
                value={addProductInfo.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full min-h-[120px] resize-none"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Photo */}
            <div className="space-y-2">
              <Label
                htmlFor="photo"
                className="text-sm font-medium leading-none"
              >
                Photo
              </Label>

              {imagePreview && (
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
              )}

              <Button
                type="button"
                onClick={handleButtonClick}
                variant={imagePreview ? "outline" : "default"}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>

              <Input
                ref={fileInputRef}
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />

              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG, WebP, GIF (Max 5MB)
              </p>
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
                name="price"
                type="number"
                placeholder="0.00"
                value={addProductInfo.price || ""}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                className="w-full"
                min="0"
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={handleClearInputs}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
