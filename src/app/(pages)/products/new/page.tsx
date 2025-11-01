"use client";
import { useAlertShowHide } from "@/app/Context/SnackBar";
import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AddNewProduct() {
  const { showAlert } = useAlertShowHide();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addProductInfo, setAddProductInfo] = useState({
    name: "",
    description: "",
    price: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setAddProductInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    });
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Additional validation
    if (
      !addProductInfo.name.trim() ||
      !addProductInfo.description.trim() ||
      addProductInfo.price <= 0
    ) {
      showAlert(
        "Please fill in all required fields with valid values",
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

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(`${domin}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success message
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

              {/* ✅ Enhanced Image Preview */}
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

              {/* ✅ Improved file input with ref */}
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
