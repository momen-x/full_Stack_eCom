"use client";
import domin from "@/app/utils/Domin";
import { useAlertShowHide } from "@/app/Context/SnackBar";
import {
  addCategortySchema,
  TCategory,
} from "@/app/validation/categoryValidation";
import InputReusable from "@/components/form/InputReusable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowBigLeft } from "lucide-react";

const AddCategoryForm = () => {
  const { showAlert } = useAlertShowHide();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TCategory>({
    mode: "onBlur",
    resolver: zodResolver(addCategortySchema),
  });

  const handleAddCategorySubmit: SubmitHandler<TCategory> = async (
    data: TCategory
  ) => {
    try {
      // ✅ Send as JSON (not FormData)
      const response = await axios.post(`${domin}/api/category`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });


      showAlert("Category created successfully!", "success", "Success");

      // ✅ Reset form
      reset();

      // router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error("❌ Error:", error);

      // ✅ Show error message
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to create category";
        showAlert(errorMessage, "destructive", "Error");
      } else {
        showAlert("An unexpected error occurred", "destructive", "Error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
        <Button onClick={() => router.back()}>
          Back <ArrowBigLeft />
        </Button>
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Add New Category
        </h1>
        <p className="text-muted-foreground text-lg">
          Create a new product category to organize your items
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold">
              Category Details
            </CardTitle>
            <CardDescription>
              Fill in the information below to create a new category
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(handleAddCategorySubmit)}>
              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-4">
                  <InputReusable
                    label="Category Title"
                    name="title"
                    placeholder="e.g., Electronics, Clothing, Books..."
                    register={register}
                    required
                    error={errors.title?.message}
                    className="w-full"
                    disabled={isSubmitting}
                  />

                  {/* Description Input */}
                  <InputReusable
                    label="Category Description"
                    name="description"
                    placeholder="Enter a brief description of this category..."
                    register={register}
                    required
                    error={errors.description?.message}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none sm:px-8"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      "Add Category"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 sm:flex-none sm:px-8"
                    size="lg"
                    onClick={() => reset()}
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use clear, descriptive titles</li>
                <li>• Keep descriptions concise but informative</li>
                <li>• Avoid duplicate category names</li>
                <li>• Use consistent naming conventions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Categories help organize your products</li>
                <li>• You can add subcategories later</li>
                <li>• Categories improve customer navigation</li>
                <li>• Consider your product catalog structure</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;
