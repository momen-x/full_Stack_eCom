"use client";

import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
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
  productName,
}: {
  id: string;
  productName?: string;
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showAlert } = useAlertShowHide();

  const handleDeleteProduct = async () => {
    setIsDeleting(true);

    try {
      await axios.delete(`${domin}/api/products/${id}`);
      showAlert("Product deleted successfully", "success");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to delete product";
        showAlert(errorMessage, "destructive");
      } else {
        showAlert("An unexpected error occurred", "destructive");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </>
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
                Delete Product
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {productName ? (
                  <>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-foreground">
                      {productName}
                    </span>
                    ? This action cannot be undone and will permanently remove
                    this product.
                  </>
                ) : (
                  "This action cannot be undone. This will permanently remove the product."
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
            onClick={handleDeleteProduct}
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
                Delete Product
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBTN;
