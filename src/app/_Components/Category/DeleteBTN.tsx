"use client";

import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useAlertShowHide } from "@/app/Context/SnackBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteBTN = ({
  id,
  categoryName,
}: {
  id: string;
  categoryName?: string;
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showAlert } = useAlertShowHide();

  const handleDeleteCategory = async () => {
    setIsDeleting(true);

    try {
      await axios.delete(`${domin}/api/category/${id}`);
      showAlert("Category deleted successfully", "success");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to delete category";
        showAlert(errorMessage, "destructive");
      } else {
        showAlert("An unexpected error occurred", "destructive");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <p className="text-red-500">Delete </p>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200"
            disabled={isDeleting}
          >
            <span className="sr-only">Delete category</span>
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
         
          </Button>
        </AlertDialogTrigger>

      

        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">
                  Delete Category
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-2">
                  {categoryName ? (
                    <>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-foreground">
                        {categoryName}
                      </span>
                      ? This action cannot be undone and will permanently remove
                      all items belonging to this category.
                    </>
                  ) : (
                    "This action cannot be undone. This will permanently remove the category and all items belonging to it."
                  )}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-6">
            <AlertDialogCancel disabled={isDeleting} className="mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/20 transition-all duration-200"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Category
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>

          {/* Warning note */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> This action will affect all products
                in this category.
              </p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteBTN;
