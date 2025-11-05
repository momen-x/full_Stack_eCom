import getCategories, { ICategory } from "@/app/server/getCategories";
import Link from "next/link";
import { Suspense } from "react";

// Disable SSR for this page
export const dynamic = "force-dynamic";

// Loading component
function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-xl bg-card border border-border animate-pulse"
        >
          <div className="text-center">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function CategoriesList() {
  let categories: ICategory[] = [];

  try {
    const response = await getCategories();
    categories = response.categories || [];
  } catch (error) {
    console.log("Error fetching categories:", error);
    categories = [];
  }

  if (categories.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <h2 className="text-xl font-semibold text-muted-foreground">
          No categories available
        </h2>
        <p className="text-muted-foreground mt-2">
          Check if the API server is running
        </p>
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/user/category/${category._id}`}
          className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:bg-accent/50 transition-all"
        >
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
            <div className="text-sm text-muted-foreground">
              View all products
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

const UserCategoryPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shop by Category</h1>

      <Suspense fallback={<CategoriesSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoriesList />
        </div>
      </Suspense>
    </div>
  );
};

export default UserCategoryPage;
