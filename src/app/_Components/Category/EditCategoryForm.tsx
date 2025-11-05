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
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const EditCategoryForm = ({ id }: { id: string | number }) => {
  const { showAlert } = useAlertShowHide();
  const router = useRouter();
  const [categoryDataF, setCategoryDataF] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TCategory>({
    mode: "onBlur",
    resolver: zodResolver(addCategortySchema),
    // ✅ Set default values from categoryData

    defaultValues: {
      title: categoryDataF.title,
      description: categoryDataF.description,
    },
  });
  useEffect(() => {
    const fetchCateg = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${domin}/api/category/${id}`);
        const category = response.data.category;

        setCategoryDataF({
          title: category.title,
          description: category.description,
        });

        // Reset form with fetched data
        reset({
          title: category.title,
          description: category.description,
        });
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCateg();
  }, [id, reset]);

  if (isLoading) return <div>Loading...</div>;
  const handleUpdateCategorySubmit: SubmitHandler<TCategory> = async (
    data: TCategory
  ) => {
    try {
      await axios.put(`${domin}/api/category/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // ✅ Correct success message
      showAlert("Category updated successfully!", "success", "Success");

      // router.push("/admin/category");
      router.refresh();
    } catch (error) {
      console.error("❌ Error:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update category";
        showAlert(errorMessage, "destructive", "Error");
      } else {
        showAlert("An unexpected error occurred", "destructive", "Error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Header Section */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Edit Category
        </h1>
        <p className="text-muted-foreground text-lg">
          Update the category information below
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
              Edit the information below to update the category
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(handleUpdateCategorySubmit)}>
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* ✅ Fixed: name="title" not name={categoryData.title} */}
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
                        Updating...
                      </>
                    ) : (
                      "Update Category"
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
                    Reset Changes
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
                <li>• Changes will affect all products in this category</li>
                <li>• Make sure the title is unique</li>
                <li>• Consider how it appears in navigation</li>
                <li>• Keep category names simple and memorable</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryForm;
