import { Iproducts } from "@/app/server/getProducts";
import domin from "@/app/utils/Domin";
import { auth } from "@/auth";
import DisplayProductList from "../../../_Components/User/product/DisplayProductsList";
import Link from "next/link";

interface IReturnData {
  user: Ilist;
  status: number;
}
interface Product {
  product: Iproducts;
  status: number;
}

interface Ilist {
  wishlist: string[];
}

const Wishlistpage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Please log in to view your wishlist</p>
      </div>
    );
  }

  const userId = session.user.id;

  try {
    // Fetch user wishlist
    const response = await fetch(`${domin}/api/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const data: IReturnData = await response.json();
    const listOfWishList = data.user.wishlist;

    // If no wishlist items
    if (listOfWishList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-xl">Your wishlist is empty</p>
          <Link href="/user/products" className="text-primary underline">
            Start shopping
          </Link>
        </div>
      );
    }

    // Fetch all products in parallel (MUCH FASTER!)
    const productPromises = listOfWishList.map(async (productId) => {
      const response = await fetch(`${domin}/api/products/${productId}`);
      if (!response.ok) return null; // Skip failed products
      const data: Product = await response.json();
      return data.product;
    });

    const wishlist = (await Promise.all(productPromises)).filter(
      (product): product is Iproducts => product !== null
    ); // Remove nulls

    return (
      <div>
        <h1 className="text-3xl font-bold p-6">My Wishlist</h1>
        <DisplayProductList products={wishlist} />
      </div>
    );
  } catch (error) {
    console.error("Error loading wishlist:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">
          Error loading wishlist. Please try again.
        </p>
      </div>
    );
  }
};

export default Wishlistpage;
