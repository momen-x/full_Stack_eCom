"use client";

import domin from "@/app/utils/Domin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Trash } from "lucide-react";

const DeleteBTN = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(true);
    
    try {

      
     await axios.delete(`${domin}/api/products/${id}`)
      
      router.refresh();
      
    
      
      
    } catch (error) {
      console.error("Delete error:", error);
      
      if (axios.isAxiosError(error)) {
       
        const errorMessage = error.response?.data?.error || "Failed to delete product";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      onClick={handleDeleteProduct} 
      variant="destructive"
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : <> delete <Trash /></>} 
    </Button>
  );
};

export default DeleteBTN;